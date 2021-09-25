import axios from '@/util/request'
import querystring from 'query-string'
import { Credentials } from '@/interface/auth'

const key: string = querystring.stringify({
  appid: process.env.VUE_APP_APPID,
  secret: process.env.VUE_APP_SECRET,
  platform: process.env.VUE_APP_PLATFORM
})

/**
 * 获取图形验证码
 */
export function getCaptcha (): Promise<any> {
  return axios.get('/auth/oauth/captcha?' + key)
}

/*
* 获取手机验证码
* */
export function getSmsCode (params: any): Promise<any> {
  return axios.post('/auth/oauth/sms?' + key, { ...params })
}

/*
*  认证获取token
* */
export function getToken (credentials: Credentials): Promise<any> {
  return axios.post('/auth/oauth/token?' + key, credentials)
}
