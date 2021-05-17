import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  // 设置token
  setToken: function(state, data) {
    // 1.数据持久化,存放在cookies
    setToken(data)
    // 2.存放在state方便vue使用
    state.token = data
  },
  // 删除缓存
  removeToken(state) {
    state.token = null
    // 清除cookies,在utils/auth中封装的函数
    removeToken()
  },
  setUserInfo(state, data) {
    state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 发送异步请求
const actions = {
  async loginHandle(store, data) {
    try {
      // 1.发请求
      const res = await login(data)
      // console.log(res)
      // const token = res.data.data
      // axios 数据包裹在res.data中
      // 后端返回的token字段也要data
      // 2.拿到成功的token
      store.commit('setToken', res)
      setTime()
    } catch (error) {
      console.log('这里报错了')
      console.log(error)
    }
  },
  async getUserInfo(store) {
    // const res = await getUserInfo()
    // store.commit('setUserInfo', res)
    // 获取基本信息在这里不够
    // 还需要在此之后获取详细信息,例如头像等
    const simpleData = await getUserInfo()
    const detail = await getUserDetailById(simpleData.userId)
    const data = {
      ...simpleData,
      ...detail
    }
    store.commit('setUserInfo', data)
    return data
  },
  logout(store) {
    store.commit('removeToken')
    store.commit('removeUserInfo')
    // 清空后来添加的路由配置
    resetRouter()
    // 清空菜单配置
    // 如果要调用兄弟之间的 mutations
    // 需要添加第三个参数, 指定查找模块是, 以根模块作为起点
    // root: true
    store.commit('permission/setRoutes', [], {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
