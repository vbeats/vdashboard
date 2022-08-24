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
}

// 用户认证
export function getToken(param: AuthParam): Promise<any> {
    return axios.post('/auth/oauth/token', {
        ...param,
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET
    })
}
