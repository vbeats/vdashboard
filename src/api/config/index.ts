import axios from '../../util/request'

export function list(param: any): Promise<any> {
    return axios.post('/admin/configParam/list', {...param})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/configParam/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/configParam/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/configParam/delete', {...param})
}