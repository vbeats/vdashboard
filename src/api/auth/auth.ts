import axios from '../../util/request'


interface AuthParam {
    account?: string
    password?: string
    grant_type: string
    tenant_code: string
    client_id?: string
    client_secret?: string
    key?: string
    code?: string
    refresh_token?: string
}

// 用户认证
export function getToken(param: AuthParam): Promise<any> {
    return axios.post('/auth/oauth/token', {
        ...param,
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET
    })
}

// 个人信息
export function profile(): Promise<any> {
    return axios.post('/admin/profile')
}

// 修改个人密码等...
export function updateAccountInfo(param: any): Promise<any> {
    return axios.post('/admin/updateProfile', {
        ...param, client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET
    })
}
