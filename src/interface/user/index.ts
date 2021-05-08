// 认证信息
export interface Credentials {
    tenant_code?: string,
    username?: string,
    password?: string,
    phone?: string,
    key?: string,
    code?: string,
    type: number,
    refresh_token?: string,
    platform?: number
}

// user相关信息
export interface UserInfo {
    user_id: number,
    tenant_id: number,
    username: string,
    nickname?: string,
    phone?: string,
    avatar?: string,
    role_id: number,
    access_token: string,
    refresh_token: string,
    menus?: Array<Menu>
}

export interface Menu {
    key: string,
    icon?: string,
    title: string,
    default_select: boolean,
    default_open: boolean,
    permissions?: string[],
    children: Array<Menu>
}
