import request from '@/utils/request'

export function getInspire(params) {
  return request({
    url: '/statistics/summation/inspire',
    method: 'get',
    params
  })
}

export function getStage(params) {
  return request({
    url: '/statistics/summation/stage',
    method: 'get',
    params
  })
}

export function getProductStage(params) {
  return request({
    url: '/statistics/product/stage',
    method: 'get',
    params
  })
}

export function getProductScore(params) {
  return request({
    url: '/statistics/product/score',
    method: 'get',
    params
  })
}

export function getProductTop(params) {
  return request({
    url: '/statistics/product/top',
    method: 'get',
    params
  })
}

export function getProductMemberLevel(params) {
  return request({
    url: '/statistics/level/index',
    method: 'get',
    params
  })
}
