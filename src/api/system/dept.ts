import axios from '@/util/request'

// 部门列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/dept/list', {...params})
}

// 新增部门
export function add(params: any): Promise<any> {
  return axios.post('/admin/dept/add', {...params})
}

// 更新部门信息
export function update(params: any): Promise<any> {
  return axios.post('/admin/dept/update', {...params})
}

// 删除部门
export function del(id: number): Promise<any> {
  return axios.post('/admin/dept/delete', {id})
}

// 分配用户
export function assignUser(params: any): Promise<any> {
  return axios.post('/admin/dept/assign_user', {...params})
}

// 某个用户拥有的dept id集合
export function listByUser(id: number): Promise<any> {
  return axios.post('/admin/dept/list_by_user', {id})
}
