import axios from '../../util/request'


interface AuthParam {
    account?: string
    password?: string
    grant_type: string
    tenant_code: string
    key?: string
    code?: string
}

// 用户认证
export function getToken(param: AuthParam): Promise<any> {
    return axios.post('/auth/oauth/token', {...param})
}

// 个人信息
export function profile(): Promise<any> {
    return axios.post('/admin/profile')
}

// 修改个人密码等...
export function updateAccountInfo(param: any): Promise<any> {
    return axios.post('/admin/updateProfile', {...param})
}
