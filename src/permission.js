// 默认会进入到文件夹的index文件
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

// 导航守卫
router.beforeEach(async(to, from, next) => {
  const whiteList = ['/login', '/404']
  NProgress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
    // 有token,跳登录页就转到首页
      next('/')
    } else {
    // 有token,跳哪个页面都可以放行
    // 后台正常放行的逻辑中
    // 就需要获取用户资料
    // await store.dispatch('user/getUserInfo')
      // 其实每次跳转页面都会经过这里
      // 最好是先确认之前没有拿过数据, 再发请求
      // 仍哦之前拿过, 直接放行即可
      // if (!store.state.user.userInfo) {}
      // 直接判断一个空对象, 其实永远是 true
      if (!store.state.user.userInfo.userId) {
        // 只能判断里面的其中一个属性在不在,没有属性,再发请求
        const res = await store.dispatch('user/getUserInfo')
        // 如果 action return 了数据, 这边可以直接获取
        console.log('触发筛选过程')
        const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
        // store.state.user.userInfo.roles.menus
        // router.addRoutes(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
        // 这里是第一次进入页面(刷新)获取用户资料
        // 用户资料里面有权限列表可以用来做筛选
        // 将筛选的逻辑放入到 vuex 里面
        // 需要准备两个数据 1. 全部的动态路由列表 2. 当前用户的信息
        // 如果是添加的路由, 添加的时间点其实晚于匹配过程, 发现一片空白
        // 需要在当前的目的地路径中原地跳一次, 重新触发匹配过程才行
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 没有token,想跳登录页,放行
      next()
    } else {
      // 没有token,想跳其他页面,需先登录
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题

  // const token = store.getters.token
  // const url = to.path
  // // 1. 有 token 想去登录页 => 跳到首页
  // if (token && url === '/login') {
  //   next('/')
  // }
  // // 2. 有 token 并非去登录页 => 放行
  // if (token && url !== '/login') {
  //   next()
  // }
  // // 3. 没有 token 跳到白名单页面 => 放行
  // if (!token && whiteList.includes(url)) {
  //   next()
  // }
  // // 4. 没有 token 又不是去白名单 => 登录页
  // if (!token && !whiteList.includes(url)) {
  //   next('/login')
  // }
})
// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
