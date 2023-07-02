import request from '@/utils/request'

// 查询等待中的任务表 列表
export function listShow(query) {
  return request({
    url: '/wtask/show/list',
    method: 'get',
    params: query
  })
}

// 查询等待中的任务表 详细
export function getShow(id) {
  return request({
    url: '/wtask/show/' + id,
    method: 'get'
  })
}

// 新增等待中的任务表 
export function addShow(data) {
  return request({
    url: '/wtask/show',
    method: 'post',
    data: data
  })
}

// 修改等待中的任务表 
export function updateShow(data) {
  return request({
    url: '/wtask/show',
    method: 'put',
    data: data
  })
}

// 删除等待中的任务表 
export function delShow(id) {
  return request({
    url: '/wtask/show/' + id,
    method: 'delete'
  })
}
