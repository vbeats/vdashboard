import axios from '../../util/request'

export function list(param: any): Promise<any> {
    return axios.post('/admin/tenant/list', {...param})
}

export function load(param: any): Promise<any> {
    return axios.post('/admin/tenant/load', {...load})
}

export function sub(param: any): Promise<any> {
    return axios.post('/admin/tenant/sub', {...param})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/tenant/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/tenant/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/tenant/delete', {...param})
}

export function block(param: any): Promise<any> {
    return axios.post('/admin/tenant/block', param)
}

export function unBlock(param: any): Promise<any> {
    return axios.post('/admin/tenant/unblock', param)
}