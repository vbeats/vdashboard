import axios from '@/util/request'

// 租户列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/tenant/list', {...params})
}

// 新增租户
export function add(params: any): Promise<any> {
  return axios.post('/admin/tenant/add', {...params})
}

// 更新租户信息
export function update(params: any): Promise<any> {
  return axios.post('/admin/tenant/update', {...params})
}

// 更新租户状态
export function updateStatus(id: number): Promise<any> {
  return axios.post('/admin/tenant/status', {id})
}

// 删除租户
export function del(id: number): Promise<any> {
  return axios.post('/admin/tenant/delete', {id})
}

// 所有租户
export function listAll(): Promise<any> {
  return axios.post('/admin/tenant/list_all')
}
