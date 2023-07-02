import request from '@/utils/request'

// 查询正在执行的任务表 列表
export function listShow(query) {
  return request({
    url: '/ctask/show/list',
    method: 'get',
    params: query
  })
}

// 查询正在执行的任务表 详细
export function getShow(id) {
  return request({
    url: '/ctask/show/' + id,
    method: 'get'
  })
}

// 新增正在执行的任务表 
export function addShow(data) {
  return request({
    url: '/ctask/show',
    method: 'post',
    data: data
  })
}

// 修改正在执行的任务表 
export function updateShow(data) {
  return request({
    url: '/ctask/show',
    method: 'put',
    data: data
  })
}

// 删除正在执行的任务表 
export function delShow(id) {
  return request({
    url: '/ctask/show/' + id,
    method: 'delete'
  })
}
