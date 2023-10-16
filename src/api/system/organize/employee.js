import request from '@/utils/request'

export function getEmployeeLists(params) {
  return request({
    url: '/system/organize/employee/lists',
    method: 'get',
    params
  })
}

export function getEmployeeAll(params) {
  return request({
    url: '/system/organize/employee/all',
    method: 'get',
    params
  })
}

export function getInfo(params) {
  return request({
    url: '/system/organize/employee/info',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/system/organize/employee/create',
    method: 'post',
    data
  })
}

export function modifyData(data) {
  return request({
    url: '/system/organize/employee/modify',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/system/organize/employee/delete',
    method: 'delete',
    data
  })
}

