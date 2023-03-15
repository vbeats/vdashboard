export interface User {
    id?: string,
    merchantId?: string,
    account?: string
    nickName?: string
    phone?: string
    merchantCode: string
    token?: string
    expire: number
    roles: Array<string>
    permissions: Array<string>
}