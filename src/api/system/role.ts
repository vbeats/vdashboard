import axios from '@/util/request'

// 角色列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/role/list', {...params})
}

// 新增角色
export function add(params: any): Promise<any> {
  return axios.post('/admin/role/add', {...params})
}

// 更新角色信息
export function update(params: any): Promise<any> {
  return axios.post('/admin/role/update', {...params})
}

// 删除角色
export function del(id: number): Promise<any> {
  return axios.post('/admin/role/delete', {id})
}

// 分配菜单/按钮
export function assignMenu(params: any): Promise<any> {
  return axios.post('/admin/role/assign_menu', {...params})
}

// 分配user
export function assignUser(params: any): Promise<any> {
  return axios.post('/admin/role/assign_user', {...params})
}

// 某个用户 拥有的role id集合
export function listByUser(id: number): Promise<any> {
  return axios.post('/admin/role/list_by_user', {id})
}
