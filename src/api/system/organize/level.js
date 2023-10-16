import request from '@/utils/request'

export function getLevelLists(params) {
  return request({
    url: '/system/organize/level/lists',
    method: 'get',
    params
  })
}

export function getLevelAll(params) {
  return request({
    url: '/system/organize/level/all',
    method: 'get',
    params
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

