import request, {AxiosRequestConfig, AxiosResponse} from 'axios'
import store from '@/store'
import {message} from "ant-design-vue"

const axios = request.create({
    baseURL: process.env.VUE_APP_API,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
})

// 异常处理
const errorHandler = (error: any): any => {
    // error.response.data
    message.error(error.toString(), 10)
    return Promise.reject(error)
}

// 请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    const user = ''//store.state.user.user
    // config.headers.common['token'] = user.access_token
    return config;
}, errorHandler)

// 响应拦截器
axios.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse> | AxiosResponse => {
    console.log("响应: " + response)
    if (response.data.code && response.data.code === 401) {
        store.dispatch('toLogin').then()
    }
    return response;
}, errorHandler);

export default axios;
