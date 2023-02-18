import axios from '../../util/request'

// admin
export function list(param: any): Promise<any> {
    return axios.get('/admin/admin/list', {params: {...param}})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/admin/add', {...param})
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/admin/update', {...param})
}

export function del(param: any): Promise<any> {
    return axios.post('/admin/admin/delete', {...param})
}

export function block(param: any): Promise<any> {
    return axios.post('/admin/admin/block', param)
}

export function unBlock(param: any): Promise<any> {
    return axios.post('/admin/admin/unblock', param)
}

export function resetPwd(param: any): Promise<any> {
    return axios.post('/admin/admin/resetPwd', param)
}

export function assignAdminRoles(param: any): Promise<any> {
    return axios.post('/admin/admin/assignAdminRoles', {...param})
}