import axios from '../../util/request'

// admin
export function list(param: any): Promise<any> {
    return axios.post('/admin/admin/list', {...param})
}

export function add(param: any): Promise<any> {
    return axios.post('/admin/admin/add', {
        ...param,
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET
    })
}

export function update(param: any): Promise<any> {
    return axios.post('/admin/admin/update', {
        ...param,
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET
    })
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