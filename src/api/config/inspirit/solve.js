import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/solve/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/solve/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/solve/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/solve/delete',
    method: 'delete',
    data
  })
}

