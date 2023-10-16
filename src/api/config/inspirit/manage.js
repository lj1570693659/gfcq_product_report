import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: '/config/inspirit/manage/all',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/config/inspirit/manage/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/inspirit/manage/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/inspirit/manage/delete',
    method: 'delete',
    data
  })
}

