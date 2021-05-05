/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 这里单独存放校验数据的方法
// 什么都不做, 仅仅返回 true / false
export function validMobile(str) {
  const pattern = /^1[3-9]\d{9}$/
  return pattern.test(str)
}
