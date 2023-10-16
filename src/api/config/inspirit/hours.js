import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/hours/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/hours/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/hours/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/hours/delete',
    method: 'delete',
    data
  })
}

