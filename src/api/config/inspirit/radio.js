import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/radio/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/radio/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/radio/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/radio/delete',
    method: 'delete',
    data
  })
}

