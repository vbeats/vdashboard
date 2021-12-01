import axios from '@/util/request'
import querystring from 'query-string'

const key: string = querystring.stringify({
  client_id: process.env.VUE_APP_CLIENTID,
  secret: process.env.VUE_APP_SECRET,
  platform: process.env.VUE_APP_PLATFORM,
  tenant_code: process.env.VUE_APP_TENANT,
})

// 获取图形验证码
export function getCaptcha(): Promise<any> {
  return axios.get('/auth/oauth2/captcha?' + key)
}

// 用户认证接口
export function getToken(params: any): Promise<any> {
  return axios.post('/auth/oauth2/token', {...params})
}

// 用户基本信息 菜单...
export function getUserProfile(): Promise<any> {
  return axios.post('/admin/basic/user_profile')
}
