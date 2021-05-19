import axios from '@/utils/request'
import {Page} from '@/interface/common/page'
import {RoleFormState, UserFormState} from "@/interface/setting/user";

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
    return axios.post('/admin/user/updateStatus', {id})
}

export function updateUserSelf(user: UserFormState): Promise<any> {
    return axios.post('/admin/user/updateSelf', user)
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