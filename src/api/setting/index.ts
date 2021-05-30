import axios from '@/utils/request'
import {Page} from '@/interface/common/page'
import {RoleFormState, UserFormState, UserRoleState} from "@/interface/setting/user";

export function getUserList(page: Page, username?: string): Promise<any> {
    return axios.post('/admin/user/list', {...page, username})
}

export function updateUser(user: UserFormState): Promise<any> {
    return axios.post('/admin/user/update', user)
}

export function addUser(user: UserFormState): Promise<any> {
    return axios.post('/admin/user/add', user)
}

export function updateUserStatus(id: number): Promise<any> {
    return axios.post('/admin/user/update_atatus', {id})
}

export function updateUserSelf(user: UserFormState): Promise<any> {
    return axios.post('/admin/user/update_self', user)
}

/*角色*/
export function getRoleList(page: Page, role_name?: string): Promise<any> {
    return axios.post('/admin/role/list', {...page, role_name})
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

export function updateUserRole(param: UserRoleState): Promise<any> {
    return axios.post('/admin/user/update_role', param)
}

export function getRoleUserList(page: Page, roleName: string): Promise<any> {
    return axios.post('/admin/user/list_by_role', {...page, role_name: roleName})
}

// 要更新的user id集合, 要取消该角色的user id集合
export function updateUserRoles(selected_keys: number[], un_selected_keys: number[], role_id: number): Promise<any> {
    return axios.post('/admin/user/update_roles', {selected_keys, un_selected_keys, role_id})
}

export function getActionList(id: number): Promise<any> {
    return axios.post('/admin/action/list', {id})
}

export function updateRoleActions(changed_items: Array<any>, role_id: number, role_name: string): Promise<any> {
    return axios.post('/admin/action/update', {changed_items, role_id, role_name})
}