import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'

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
  },
  logout(store) {
    store.commit('removeToken')
    store.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
