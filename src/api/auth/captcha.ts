import axios from '../../util/request'
import queryString from 'query-string'

const key: string = queryString.stringify({
    client_id: import.meta.env.VITE_CLIENT_ID,
    client_secret: import.meta.env.VITE_CLIENT_SECRET,
})

// 获取图形验证码
export function getCaptcha(): Promise<any> {
    return axios.get('/auth/oauth/captcha?' + key)
}
