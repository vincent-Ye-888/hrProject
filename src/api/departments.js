import request from '@/utils/request'
// 这里主要用于获取架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
