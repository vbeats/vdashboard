import axios from '@/utils/request'
import querystring from 'query-string'

const key: string = querystring.stringify({
    appid: process.env.VUE_APP_APPID,
    secret: process.env.VUE_APP_SECRET
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