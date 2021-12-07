import axios from '@/util/request'

// oauth2 client列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/oauth2/list', {...params})
}

// 新增oauth2 client
export function add(params: any): Promise<any> {
  return axios.post('/admin/oauth2/add', {...params})
}

// 更新oauth2 client信息
export function update(params: any): Promise<any> {
  return axios.post('/admin/oauth2/update', {...params})
}

// 删除oauth2 client
export function del(id: number): Promise<any> {
  return axios.post('/admin/oauth2/delete', {id})
}
