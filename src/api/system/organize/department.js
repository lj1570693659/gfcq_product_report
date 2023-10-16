import request from '@/utils/request'

export function getDepartmentLists(params) {
  return request({
    url: '/system/organize/department/lists',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/system/organize/department/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/system/organize/department/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/system/organize/department/delete',
    method: 'delete',
    data
  })
}

