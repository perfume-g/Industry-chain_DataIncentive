import request from '@/utils/request'

// 查询任务表 列表
export function listTaskAllocation(query) {
  return request({
    url: '/task/taskAllocation/list',
    method: 'get',
    params: query
  })
}

// 查询任务表 详细
export function getTaskAllocation(id) {
  return request({
    url: '/task/taskAllocation/' + id,
    method: 'get'
  })
}

// 新增任务表 
export function addTaskAllocation(data) {
  return request({
    url: '/task/taskAllocation',
    method: 'post',
    data: data
  })
}

// 修改任务表 
export function updateTaskAllocation(data) {
  return request({
    url: '/task/taskAllocation',
    method: 'put',
    data: data
  })
}

// 删除任务表 
export function delTaskAllocation(id) {
  return request({
    url: '/task/taskAllocation/' + id,
    method: 'delete'
  })
}
