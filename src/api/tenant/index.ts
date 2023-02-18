import axios from '../../util/request'

export function list(param: any): Promise<any> {
    return axios.get('/admin/tenant/list', {params: {...param}})
}

export function listTenantTree(): Promise<any> {
    return axios.get('/admin/tenant/listTenantTree')
}

export function sub(param: any): Promise<any> {
    return axios.get('/admin/tenant/sub', {params: {...param}})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/tenant/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/tenant/update', {...param})
}