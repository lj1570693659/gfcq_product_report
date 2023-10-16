import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/account/user/signin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/system/account/user/profile',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/system/account/user/signout',
    method: 'post'
  })
}

export function getDetail(params) {
  return request({
    url: '/system/organize/employee/info',
    method: 'get',
    params
  })
}

export function changepwd(data) {
  return request({
    url: '/system/account/user/changepwd',
    method: 'put',
    data
  })
}

export function getLogList(params) {
  return request({
    url: '/system/account/log/lists',
    method: 'get',
    params
  })
}
