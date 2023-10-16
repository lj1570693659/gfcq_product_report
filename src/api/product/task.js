import request from '@/utils/request'

export function getTreeByProduct(params) {
  return request({
    url: '/plm/product/task',
    method: 'get',
    params
  })
}

export function getDeliverable(params) {
  return request({
    url: '/plm/product/taskCount',
    method: 'get',
    params
  })
}

export function getDocCate(params) {
  return request({
    url: '/plm/doc/lists',
    method: 'get',
    params
  })
}

export function getProductTask(params) {
  return request({
    url: '/plm/doc/task',
    method: 'get',
    params
  })
}

export function getDocCompute(params) {
  return request({
    url: '/plm/doc/compute',
    method: 'get',
    params
  })
}

export function getProductStage(params) {
  return request({
    url: '/plm/doc/statistics',
    method: 'get',
    params
  })
}

export function getProductStatistics(params) {
  return request({
    url: '/plm/doc/product_statistics',
    method: 'get',
    params
  })
}

export function getDepartStatistics(params) {
  return request({
    url: '/plm/doc/depart_statistics',
    method: 'get',
    params
  })
}
