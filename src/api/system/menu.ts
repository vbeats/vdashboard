import axios from '@/util/request'

// 菜单列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/menu/list', {...params})
}

// 新增菜单
export function add(params: any): Promise<any> {
  return axios.post('/admin/menu/add', {...params})
}

// 更新菜单信息
export function update(params: any): Promise<any> {
  return axios.post('/admin/menu/update', {...params})
}

// 删除菜单
export function del(id: number): Promise<any> {
  return axios.post('/admin/menu/delete', {id})
}

// 某个角色菜单 id集合
export function listMenuByRole(id: number): Promise<any> {
  return axios.post('/admin/menu/list_by_role', {id})
}
