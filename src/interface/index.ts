// 认证信息
export interface Credentials {
    tenant_code?: string,
    username?: string,
    password?: string,
    phone?: string,
    key?: string,
    code?: string,
    type: number,
    refresh_token?: string
}

// token相关信息
export interface Token {
    user_id: number,
    tenant_code: string,
    username: string,
    nickname?: string,
    phone?: string,
    avatar?: string,
    roles?: string,
    access_token: string,
    refresh_token: string,
    expires: number,
}
