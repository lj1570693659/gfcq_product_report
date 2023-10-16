import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/product/mode/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/product/mode/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/product/mode/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/product/mode/delete',
    method: 'delete',
    data
  })
}

