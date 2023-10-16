import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/config/product/roles/lists',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/product/roles/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/product/roles/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/product/roles/delete',
    method: 'delete',
    data
  })
}

