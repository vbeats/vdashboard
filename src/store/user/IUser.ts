export interface User {
    id?: string,
    tenant_id?: string,
    account?: string
    nick_name?: string
    phone?: string
    tenant_code: string
    token?: string
    roles: Array<string>
    permissions: Array<string>
}