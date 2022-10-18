export interface User {
    id?: string,
    tenant_id?: string,
    username?: string
    phone?: string
    tenant_code: string
    token?: string
}

export interface Token {
    id: string,
    tenant_id: string,
    tenant_code: string
    token?: string
}