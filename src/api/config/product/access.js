import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/config/product/assess/lists',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/product/assess/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/product/assess/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/product/assess/delete',
    method: 'delete',
    data
  })
}

