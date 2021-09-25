import axios from '@/util/request'

// ----------------------- 用户
/*
*  更新用户信息
* */
export function updateUserProfile (params: any): Promise<any> {
  return axios.post('/admin/user/update_self', { ...params })
}

export function getUserIdsByRoleId (params: any): Promise<any> {
  return axios.post('/admin/user/list_by_role', { ...params })
}

export function getAdminList (params: any): Promise<any> {
  return axios.post('/admin/user/list', { ...params })
}

export function delAdmin (params: any): Promise<any> {
  return axios.post('/admin/user/delete', { ...params })
}

export function addAdmin (params: any): Promise<any> {
  return axios.post('/admin/user/add', { ...params })
}

export function updateAdmin (params: any): Promise<any> {
  return axios.post('/admin/user/update', { ...params })
}

export function assignRole (params: any): Promise<any> {
  return axios.post('/admin/user/assign_role', { ...params })
}

export function updateAdminStatus (params: any): Promise<any> {
  return axios.post('/admin/user/update_status', { ...params })
}

// ---------------------- 菜单

export function getMenuList (params: any): Promise<any> {
  return axios.post('/admin/menu/list', { ...params })
}

export function getMenuIdsByRoleId (params: any): Promise<any> {
  return axios.post('/admin/menu/list_by_role', { ...params })
}

export function addMenu (params: any): Promise<any> {
  return axios.post('/admin/menu/add', { ...params })
}

export function updateMenu (params: any): Promise<any> {
  return axios.post('/admin/menu/update', { ...params })
}

export function delMenu (params: any): Promise<any> {
  return axios.post('/admin/menu/delete', { ...params })
}

export function getMenuParent (): Promise<any> {
  return axios.post('/admin/menu/list/parent')
}

// ---------------------------角色
export function getRoleList (params: any): Promise<any> {
  return axios.post('/admin/role/list', { ...params })
}

export function getRoleIdsByAdminId (params: any): Promise<any> {
  return axios.post('/admin/role/list_by_admin', { ...params })
}

export function addRole (params: any): Promise<any> {
  return axios.post('/admin/role/add', { ...params })
}

export function updateRole (params: any): Promise<any> {
  return axios.post('/admin/role/update', { ...params })
}

export function delRole (params: any): Promise<any> {
  return axios.post('/admin/role/delete', { ...params })
}

export function assignRoleAdmin (params: any): Promise<any> {
  return axios.post('/admin/role/assign_user', { ...params })
}

export function assignRoleMenu (params: any): Promise<any> {
  return axios.post('/admin/role/assign_menu', { ...params })
}

// ---------------------------租户
export function getAllTenant (): Promise<any> {
  return axios.post('/admin/tenant/list_all_tenant')
}

export function getTenantList (params: any): Promise<any> {
  return axios.post('/admin/tenant/list', { ...params })
}

export function delTenant (params: any): Promise<any> {
  return axios.post('/admin/tenant/del', { ...params })
}

export function updateTenant (params: any): Promise<any> {
  return axios.post('/admin/tenant/update', { ...params })
}

export function addTenant (params: any): Promise<any> {
  return axios.post('/admin/tenant/add', { ...params })
}
