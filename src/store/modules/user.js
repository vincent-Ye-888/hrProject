import { login } from '@/api/user'
import { setToken, getToken } from '@/utils/auth'

const state = {
  token: getToken()
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
  }
}

const actions = {
  async loginHandle(store, data) {
    // 1.发请求
    const res = await login(data)
    console.log(res)
    const token = res.data.data
    // axios 数据包裹在res.data中
    // 后端返回的token字段也要data
    // 2.拿到成功的token
    store.commit('setToken', token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
