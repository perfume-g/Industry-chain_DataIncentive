import request from '@/utils/request'

// 查询企业表列表
export function listEnterprise(query) {
  return request({
    url: '/coalition/enterprise/list',
    method: 'get',
    params: query
  })
}

// 查询企业表详细
export function getEnterprise(id) {
  return request({
    url: '/coalition/enterprise/' + id,
    method: 'get'
  })
}

// 新增企业表
export function addEnterprise(data) {
  return request({
    url: '/coalition/enterprise',
    method: 'post',
    data: data
  })
}

// 修改企业表
export function updateEnterprise(data) {
  return request({
    url: '/coalition/enterprise',
    method: 'put',
    data: data
  })
}

// 删除企业表
export function delEnterprise(id) {
  return request({
    url: '/coalition/enterprise/' + id,
    method: 'delete'
  })
}
