import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/plm/product/lists',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: '/product/all',
    method: 'get',
    params
  })
}

export function getInfo(params) {
  return request({
    url: '/product/info',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/product/detail',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/product/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/product/delete',
    method: 'delete',
    data
  })
}

export function importMember(data) {
  return request({
    url: '/product/member/import',
    method: 'post',
    data
  })
}

export function getMemberLists(params) {
  return request({
    url: '/product/member/lists',
    method: 'get',
    params
  })
}

export function modifyMemberData(data) {
  return request({
    url: '/product/member/modify',
    method: 'put',
    data
  })
}

export function deleteProductMember(data) {
  return request({
    url: '/product/member/delete',
    method: 'delete',
    data
  })
}
