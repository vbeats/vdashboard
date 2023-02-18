import axios from '../../util/request'

// 菜单
export function menus(): Promise<any> {
    return axios.get('/admin/menu/menus')
}

// -------------
export function list(): Promise<any> {
    return axios.get('/admin/menu/list')
}

export function sub(param: any): Promise<any> {
    return axios.get('/admin/menu/sub', {params: {...param}})
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
    return axios.get("/admin/menu/listRoleMenu", {params: {...param}})
}