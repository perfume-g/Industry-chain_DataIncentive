import request from '@/utils/request'

// 查询操作员表列表
export function listManage(query) {
  return request({
    url: '/operator/manage/list',
    method: 'get',
    params: query
  })
}

// 查询操作员表详细
export function getManage(id) {
  return request({
    url: '/operator/manage/' + id,
    method: 'get'
  })
}

// 新增操作员表
export function addManage(data) {
  return request({
    url: '/operator/manage',
    method: 'post',
    data: data
  })
}

// 修改操作员表
export function updateManage(data) {
  return request({
    url: '/operator/manage',
    method: 'put',
    data: data
  })
}

// 删除操作员表
export function delManage(id) {
  return request({
    url: '/operator/manage/' + id,
    method: 'delete'
  })
}
