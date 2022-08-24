import axios from '../../util/request'


// 获取图形验证码
export function getCaptcha(): Promise<any> {
    return axios.get('/auth/oauth/captcha')
}
