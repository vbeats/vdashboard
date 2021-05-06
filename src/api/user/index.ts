import axios from '@/utils/request'
import querystring from 'query-string'
import {Credentials} from "@/interface";

const key: string = querystring.stringify({
    appid: process.env.VUE_APP_APPID,
    secret: process.env.VUE_APP_SECRET
})

/**
 * 获取图形验证码
 */
export function getCaptcha(): Promise<any> {
    return axios.get('/auth/captcha?' + key)
}

/*
* 获取手机验证码
* */
export function getSmsCode(phone: string, tenant_code: string): Promise<any> {
    return axios.post('/auth/sms?' + key, {phone, tenant_code})
}

/*
*  认证获取token
* */
export function getToken(credentials: Credentials): Promise<any> {
    return axios.post('/auth/token?' + key, credentials)
}