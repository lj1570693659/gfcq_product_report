import request from '@/utils/request'

export function getAll(params) {
  let url = ''
  if (params === undefined) {
    url = '/config/product/stage/all/0'
  } else {
    url = '/config/product/stage/all/' + params
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/config/product/stage/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/config/product/stage/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/config/product/stage/delete',
    method: 'delete',
    data
  })
}

