import request from '@/utils/request'

// export function createData(data) {
//   return request({
//     url: '/achieve/product/create',
//     method: 'post',
//     data
//   })
// }

// export function getLists(params) {
//   return request({
//     url: '/achieve/product/lists',
//     method: 'get',
//     params
//   })
// }

// export function exportMemberList(data) {
//   return request({
//     url: '/achieve/product/member/export',
//     method: 'post',
//     data
//   })
// }

export function computeMemberPrize(data) {
  return request({
    url: '/achieve/product/prize/compute',
    method: 'post',
    data
  })
}

export function getProductMemberKeyLists(params) {
  return request({
    url: '/achieve/product/crucial/lists',
    method: 'get',
    params
  })
}

export function createProductMemberKey(data) {
  return request({
    url: '/achieve/product/crucial/create',
    method: 'post',
    data
  })
}

export function modifyProductMemberKey(data) {
  return request({
    url: '/achieve/product/crucial/modify',
    method: 'put',
    data
  })
}

export function deleteProductMemberKey(data) {
  return request({
    url: '/achieve/product/crucial/delete',
    method: 'delete',
    data
  })
}

export function getProductPrizeLists(params) {
  return request({
    url: '/achieve/product/prize/lists',
    method: 'get',
    params
  })
}

export function exportProductMemberPrize(data) {
  return request({
    url: '/achieve/product/prize/export',
    method: 'post',
    data
  })
}
