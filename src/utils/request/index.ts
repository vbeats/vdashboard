import request, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import store from '@/store'
import * as types from '@/store/actionTypes'
import {message} from "ant-design-vue"

const axios: AxiosInstance = request.create({
    baseURL: process.env.VUE_APP_API,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
})

// 异常处理
const errorHandler = (error: any): any => {
    console.log(error, '--------------------------')
    // error.response.data
    message.error(error.toString(), 10)
    return Promise.reject(error)
}

// 请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    // const user = ''//store.state.user.user
    // config.headers.common['token'] = user.access_token
    return config;
}, errorHandler)

// 响应拦截器
axios.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse> | AxiosResponse => {

    if (response.data.code) {
        switch (response.data.code) {
            case 400:
                message.error(response.data.msg, 3)
                break
            case 401:
                store.dispatch(types.LOGOUT).then()
                break
            case 200:
                return response.data
        }

        throw new Error()
    }

    return response
}, errorHandler)

export default axios
