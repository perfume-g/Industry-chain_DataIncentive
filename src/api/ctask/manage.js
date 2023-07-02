import request from '@/utils/request'

// 查询正在执行的任务表 列表
export function listManage(query) {
  return request({
    url: '/ctask/manage/list',
    method: 'get',
    params: query
  })
}

// 查询正在执行的任务表 详细
export function getManage(id) {
  return request({
    url: '/ctask/manage/' + id,
    method: 'get'
  })
}

// 新增正在执行的任务表 
export function addManage(data) {
  return request({
    url: '/ctask/manage',
    method: 'post',
    data: data
  })
}

// 修改正在执行的任务表 
export function updateManage(data) {
  return request({
    url: '/ctask/manage',
    method: 'put',
    data: data
  })
}

// 删除正在执行的任务表 
export function delManage(id) {
  return request({
    url: '/ctask/manage/' + id,
    method: 'delete'
  })
}
