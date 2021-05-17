import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 这里创建一个变量
  // 储存我们自己筛选完毕的菜单
  // 供 sidebar 渲染
  // 替代默认routes 选项
  routes: []
}
const mutations = {
  setRoutes(state, data) {
    state.routes = [...constantRoutes, ...data]
  }
}
const actions = {
  // 封装一个函数可以根据用户数据
  // 筛选出他有权限访问的页面路由配置
  // 1. 用户资料 (调用的时候传进来)
  // 2. 路由列表 (可以通过直接 import )
  filterRoutes(store, menus) {
    // 应该配合全部的动态路由列表
    // 和用户的 menus 权限数组
    // 筛选出名字存在于 menus 里面的路由
    const res = asyncRoutes.filter(route => menus.includes(route.name))
    console.log(res)
    store.commit('setRoutes', res)
    return res
  }
}

export default {
  namespaced: true, // 命名空间锁
  state,
  mutations,
  actions
}
