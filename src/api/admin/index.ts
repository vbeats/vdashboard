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