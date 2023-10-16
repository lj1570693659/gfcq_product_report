import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/product/type/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/product/type/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/product/type/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/product/type/delete',
    method: 'delete',
    data
  })
}

