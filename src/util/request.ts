import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import store from '@/store'
import {message} from 'ant-design-vue'
import router from '@/router'

const request: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
})

// 异常处理
const errorHandler = (error: any): any => {
  message.error(error.toString(), 8)
  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use((config: AxiosRequestConfig) => {
  const user = store.getters.getUserInfo
  config.headers && (config.headers.Authorization = 'Bearer ' + user.access_token)
  return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse> | AxiosResponse => {
  if (response.data.code) {
    switch (response.data.code) {
      case 401:
        store.dispatch('logout').then()
        router.replace({name: 'login'}).then()
        break
      case 200:
        return response.data
      default:
        message.error(response.data.msg, 8)
    }

    throw new Error()
  }

  return response
}, errorHandler)

export default request
