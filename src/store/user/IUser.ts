export interface User {
    username?: string
    phone?: string
    tenant_code: string
    access_token?: string
    refresh_token?: string
    access_token_expire: number
    refresh_token_expire: number
}

export interface Token {
    tenant_code: string
    access_token?: string
    refresh_token?: string
}