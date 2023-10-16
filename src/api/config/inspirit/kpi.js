import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/kpiRule/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/kpiRule/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/kpiRule/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/kpiRule/delete',
    method: 'delete',
    data
  })
}

