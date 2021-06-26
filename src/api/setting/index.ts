import axios from '@/utils/request'
import {Page} from '@/interface/common/page'
import {RoleFormState, UserFormState} from "@/interface/setting/user";

export function getAdminList(page: Page, username?: string): Promise<any> {
    return axios.post('/admin/admin/list', {...page, username})
}

export function updateAdmin(user: UserFormState): Promise<any> {
    return axios.post('/admin/admin/update', user)
}

export function addUser(user: UserFormState): Promise<any> {
    return axios.post('/admin/admin/add', user)
}

export function updateAdminStatus(id: number): Promise<any> {
    return axios.post('/admin/admin/update_status', {id})
}

export function updateUserSelf(user: UserFormState): Promise<any> {
    return axios.post('/admin/admin/update_self', user)
}

/*角色*/
export function getRoleList(page: Page, role_name?: string, tid?: number): Promise<any> {
    return axios.post('/admin/role/list', {...page, role_name, tid})
}

export function updateRole(role: RoleFormState): Promise<any> {
    return axios.post('/admin/role/update', role)
}

export function addRole(role: RoleFormState): Promise<any> {
    return axios.post('/admin/role/add', role)
}

export function delRole(id: number): Promise<any> {
    return axios.post('/admin/role/delete', {id})
}

export function getRoleUserList(page: Page, roleName: string): Promise<any> {
    return axios.post('/admin/admin/list_by_role', {...page, role_name: roleName})
}

// 要更新的admin id集合, 要取消该角色的user id集合
export function updateAdminRoles(selected_keys: number[], un_selected_keys: number[], role_id: number): Promise<any> {
    return axios.post('/admin/admin/update_roles', {selected_keys, un_selected_keys, role_id})
}

export function getActionList(id: number): Promise<any> {
    return axios.post('/admin/action/list', {id})
}

export function updateRoleActions(changed_items: Array<any>, role_id: number, role_name: string): Promise<any> {
    return axios.post('/admin/action/update', {changed_items, role_id, role_name})
}


// ---------tenant
export function getTenantList(page: Page, tenant_name?: string): Promise<any> {
    return axios.post('/admin/tenant/list', {...page, tenant_name})
}

export function updateTenant(param: any): Promise<any> {
    return axios.post('/admin/tenant/update', {...param})
}

export function addTenant(param: any): Promise<any> {
    return axios.post('/admin/tenant/add', {...param})
}

export function delTenant(param: any): Promise<any> {
    return axios.post('/admin/tenant/delete', {...param})
}

// --------actions

export function getActionsList(page: Page, api?: string): Promise<any> {
    return axios.post('/admin/action/list_item', {...page, api})
}

export function updateAction(param: any): Promise<any> {
    return axios.post('/admin/action/update_item', {...param})
}

export function addAction(param: any): Promise<any> {
    return axios.post('/admin/action/add', {...param})
}

export function delAction(param: any): Promise<any> {
    return axios.post('/admin/action/delete', {...param})
}

// ------menu
export function getParentMenu(param: any): Promise<any> {
    return axios.post('/admin/menu/list_by_tenant', {...param})
}

export function getMenuList(page: Page): Promise<any> {
    return axios.post('/admin/menu/list', {...page})
}

export function updateMenu(param: any): Promise<any> {
    return axios.post('/admin/menu/update', {...param})
}

export function addMenu(param: any): Promise<any> {
    return axios.post('/admin/menu/add', {...param})
}

export function delMenu(param: any): Promise<any> {
    return axios.post('/admin/menu/delete', {...param})
}