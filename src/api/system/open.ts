import axios from '@/util/request'

// 开放平台配置信息 列表
export function list(params: any): Promise<any> {
  return axios.post('/admin/open/list', {...params})
}

// 新增配置
export function add(params: any): Promise<any> {
  return axios.post('/admin/open/add', {...params})
}

// 更新配置
export function update(params: any): Promise<any> {
  return axios.post('/admin/open/update', {...params})
}

// 删除配置
export function del(id: number): Promise<any> {
  return axios.post('/admin/open/delete', {id})
}
