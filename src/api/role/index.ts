import axios from '../../util/request'

// 角色
export function list(param: any): Promise<any> {
    return axios.post('/admin/role/list', {...param})
}

export function listV2(): Promise<any> {
    return axios.post('/admin/role/listV2')
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/role/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/role/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/role/delete', {...param})
}

export function assignRoleMenu(param: any): Promise<any> {
    return axios.post('/admin/role/assignMenu', {...param})
}