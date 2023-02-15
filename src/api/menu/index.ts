import axios from '../../util/request'
import {MenuQueryParam} from "./IMenuParam"

// 菜单
export function menus(param?: MenuQueryParam): Promise<any> {
    return axios.post('/admin/menu/menus', {...param})
}

// -------------
export function list(): Promise<any> {
    return axios.post('/admin/menu/list')
}

export function sub(param: any): Promise<any> {
    return axios.post('/admin/menu/sub', {...param})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/menu/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/menu/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/menu/delete', {...param})
}

export function listRoleMenu(param?: any): Promise<any> {
    return axios.post("/admin/menu/listRoleMenu", {...param})
}