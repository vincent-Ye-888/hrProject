import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const Timekey = 'hrsass-time-key'

// 处理token持久化
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 处理时间持久化
export function getTime() {
  return Cookies.get(Timekey)
}

export function setTime() {
  const date = new Date()
  return Cookies.set(Timekey, date.getTime())
}
