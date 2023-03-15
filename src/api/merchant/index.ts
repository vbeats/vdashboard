import axios from '../../util/request'

export function list(param: any): Promise<any> {
    return axios.get('/admin/merchant/list', {params: {...param}})
}

export function listMerchantTree(): Promise<any> {
    return axios.get('/admin/merchant/listMerchantTree')
}

export function sub(param: any): Promise<any> {
    return axios.get('/admin/merchant/sub', {params: {...param}})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/merchant/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/merchant/update', {...param})
}