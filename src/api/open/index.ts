import axios from '../../util/request'

// open config
export function list(param: any): Promise<any> {
    return axios.post('/admin/open/list', {...param})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/open/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/open/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/open/delete', {...param})
}