import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/config/inspirit/budget/lists',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: '/config/inspirit/budget/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/budget/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/budget/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/budget/delete',
    method: 'delete',
    data
  })
}

