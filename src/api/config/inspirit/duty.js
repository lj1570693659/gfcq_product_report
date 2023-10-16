import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/duty/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/duty/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/duty/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/duty/delete',
    method: 'delete',
    data
  })
}

