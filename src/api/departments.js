import request from '@/utils/request'

// 这里主要用于获取架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除部门
export function delDepartments(id) {
  return request({
    method: 'delete',
    url: '/company/department/' + id
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

// 根据id获取详情
export function getDepartmentDetail(id) {
  return request({
    url: '/company/department/' + id
  })
}

// 根据 id 修改部门详情
export function editDepartment(data) {
  return request({
    url: '/company/department/' + data.id,
    method: 'put',
    data
  })
}
