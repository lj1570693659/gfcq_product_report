import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/config/product/confirm/lists',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/product/confirm/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/product/confirm/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/product/confirm/delete',
    method: 'delete',
    data
  })
}

