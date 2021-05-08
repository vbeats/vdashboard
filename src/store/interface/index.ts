import {UserInfo} from "@/interface/user"

export interface SLanguage {
    lang: string
}

export interface SUser {
    user: UserInfo,
    access_token_expire: number,    // 过期时间 毫秒时间戳
    refresh_token_expire: number
}

export interface State {
    user: SUser,
    app: SLanguage
}