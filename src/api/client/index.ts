import axios from '../../util/request'

// 获取应用参数
export function list(param: any): Promise<any> {
    return axios.post('/admin/client/list', {...param})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/client/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/client/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/client/delete', {...param})
}