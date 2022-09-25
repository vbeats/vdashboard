export interface User {
    id?: string,
    tenant_id?: string,
    username?: string
    phone?: string
    tenant_code: string
    access_token?: string
    refresh_token?: string
    access_token_expire: number
    refresh_token_expire: number
}

export interface Token {
    id: string,
    tenant_id: string,
    tenant_code: string
    access_token?: string
    refresh_token?: string
}