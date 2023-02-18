export interface User {
    id?: string,
    tenantId?: string,
    account?: string
    nickName?: string
    phone?: string
    tenantCode: string
    token?: string
    expire: number
    roles: Array<string>
    permissions: Array<string>
}