// 认证信息
export interface Credentials {
    tenant_code: string,
    username?: string,
    password?: string,
    phone?: string,
    key?: string,
    code?: string,
    type: number,
    refresh_token?: string
}
