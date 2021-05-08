import axios from '@/utils/request'
import querystring from 'query-string'
import {Credentials} from "@/interface/user"

const key: string = querystring.stringify({
    appid: import.meta.env.VITE_APP_APPID,
    secret: import.meta.env.VITE_APP_SECRET
})

/**
 * 获取图形验证码
 */
export function getCaptcha(): Promise<any> {
    return axios.get('/auth/oauth/captcha?' + key)
}

/*
* 获取手机验证码
* */
export function getSmsCode(phone: string, tenant_code: string): Promise<any> {
    return axios.post('/auth/oauth/sms?' + key, {phone, tenant_code})
}

/*
*  认证获取token
* */
export function getToken(credentials: Credentials): Promise<any> {
    return axios.post('/auth/oauth/token?' + key, credentials)
}