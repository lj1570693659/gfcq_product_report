import request from '@/utils/request'

export function createData(data) {
  return request({
    url: '/achieve/product/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/achieve/product/modify',
    method: 'put',
    data
  })
}

export function getLists(params) {
  return request({
    url: '/achieve/product/lists',
    method: 'get',
    params
  })
}

export function exportMemberList(data) {
  return request({
    url: '/achieve/product/member/export',
    method: 'post',
    data
  })
}

export function importMemberList(data) {
  return request({
    url: '/achieve/product/member/import',
    method: 'post',
    data
  })
}

export function getStageKpiInfo(params) {
  return request({
    url: '/achieve/product/info',
    method: 'get',
    params
  })
}

export function getProductMemberKpiLists(params) {
  return request({
    url: '/achieve/product/member/lists',
    method: 'get',
    params
  })
}

export function modifyProductMemberKpi(data) {
  return request({
    url: '/achieve/product/member/modify',
    method: 'put',
    data
  })
}
