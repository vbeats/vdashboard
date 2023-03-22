import axios from '../../util/request'

interface AuthParam {
    account?: string
    password?: string
    grantType: string
    tenantCode: string
    key?: string
    code?: string
}

// 用户认证
export function getToken(param: AuthParam): Promise<any> {
    return axios.post('/auth/oauth/token', {...param})
}

export function refreshToken(param: AuthParam): Promise<any> {
    return axios.post('/auth/oauth/refresh', {...param})
}

// 修改个人密码等...
export function updateAccountInfo(param: any): Promise<any> {
    return axios.post('/admin/admin/updateProfile', {...param})
}
