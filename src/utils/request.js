import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTime } from '@/utils/auth'

// 返回的是一个true / false
const checkTimeout = () => {
  const currentTime = (new Date()).getTime()
  const loginTime = getTime()
  const duration = 1000 * 60 * 60 * 2
  return currentTime - loginTime > duration
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// request interceptor  请求拦截器
service.interceptors.request.use(
  config => {
    // 先检验是否有token
    const token = store.getters.token
    if (token) {
      if (checkTimeout()) {
        // 退出 + 报错
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token 已超时'))
      } else {
        // 如果有token就带在config上
        config.headers.Authorization = 'Bearer ' + token
      }
    }
    return config
  },
  err => {
    Message.error(err.message)
    return Promise.reject(err)
  }
)

// response interceptor  响应拦截器
// use 函数可以接受两个参数
// 第一个是成功回调, 第二个是失败回调
service.interceptors.response.use(
  res => {
    // 网络请求层面成功
    const { success, message, data } = res.data
    if (success) {
      // 数据层面也对了
      return data
    } else {
      // 数据层面除了问题
      // 如果是数据层面的失败
      // 也需要提示用户
      // 还要讲当前的 promise 拒绝掉
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  err => {
    // 网络请求层面的失败
    // console.log('网络请求层面的错误')
    // console.log(err)
    // 这里是请求过程中, 拦截器发现错误
    // 如果想要将当前正在执行的 promise 拒绝掉
    // 直接走 catch 逻辑
    // 返回 Promise.reject(err) 即可

    // 我们的当前项目如果token出错会直接导致网络请求层面的失败
    // 处理应该写在这
    console.dir(err)
    if (err.response && err.response.data && err.response.data.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
    }

    Message.error(err.message)
    return Promise.reject(err)
  }
)

export default service
