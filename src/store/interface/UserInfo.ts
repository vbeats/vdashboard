export interface UserInfo {
  tenant_code?: string
  access_token?: string
  refresh_token?: string
  account?: string
  nick_name?: string
  avatar?: string
  gender?: string
  menus?: Array<MenuItem>
}

export interface MenuItem {
  title?: string
  key?: string
  icon?: string
  path?: string
}
