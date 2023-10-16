import request from '@/utils/request'

export function getLevelLists(params) {
  return request({
    url: '/system/organize/level/lists',
    method: 'get',
    params
  })
}

export function getJobLists(params) {
  return request({
    url: '/system/organize/job/lists',
    method: 'get',
    params
  })
}

export function getJobAll(params) {
  return request({
    url: '/system/organize/job/all',
    method: 'get',
    params
  })
}

export function createJobData(data) {
  return request({
    url: '/system/organize/job/create',
    method: 'post',
    data
  })
}

export function modifyJobData(data) {
  return request({
    url: '/system/organize/job/modify',
    method: 'put',
    data
  })
}

export function deleteJobData(data) {
  return request({
    url: '/system/organize/job/delete',
    method: 'delete',
    data
  })
}

export function createData(data) {
  return request({
    url: '/system/organize/level/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/system/organize/level/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/system/organize/level/delete',
    method: 'delete',
    data
  })
}

