export interface UserInfo {
  tenant_code?: string
  tenant_id?: string
  type?: number
  account?: string
  nick_name?: string
  avatar?: string
  gender?: string
  phone?: string
  access_token?: string
  refresh_token?: string
  access_token_expire?: number
  refresh_token_expire?: number
  menus?: Array<MenuItem>
}

export interface MenuItem {
  title?: string
  key?: string
  icon?: string
  path?: string
}
