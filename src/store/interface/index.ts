import {Token} from "@/interface"

export interface SLanguage {
    lang: string
}

export interface SUser {
    user: Token,
    access_token_expire: number,    // 过期时间 秒时间戳
    refresh_token_expire: number
}

export interface State {
    user: SUser,
    app: SLanguage
}