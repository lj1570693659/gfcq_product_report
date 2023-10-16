import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/overtime/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/overtime/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/overtime/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/overtime/delete',
    method: 'delete',
    data
  })
}

