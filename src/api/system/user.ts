import axios from '@/util/request'

// 用户列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/user/list', {...params})
}

// 新增用户
export function add(params: any): Promise<any> {
  return axios.post('/admin/user/add', {...params})
}

// 更新用户
export function update(params: any): Promise<any> {
  return axios.post('/admin/user/update', {...params})
}

// 修改用户状态
export function updateStatus(id: number): Promise<any> {
  return axios.post('/admin/user/status', {id})
}

// 删除用户
export function del(id: number): Promise<any> {
  return axios.post('/admin/user/delete', {id})
}

// 某个角色下的user id集合
export function listByRole(id: number): Promise<any> {
  return axios.post('/admin/user/list_by_role', {id})
}

// 某个部门下的user id集合
export function listByDept(id: number): Promise<any> {
  return axios.post('/admin/user/list_by_dept', {id})
}

// 分配角色
export function assignRole(params: any): Promise<any> {
  return axios.post('/admin/user/assign_role', {...params})
}

// 分配部门
export function assignDept(params: any): Promise<any> {
  return axios.post('/admin/user/assign_dept', {...params})
}
