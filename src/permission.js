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
        await store.dispatch('user/getUserInfo')
      }
      next()
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
