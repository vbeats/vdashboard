import request, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import store from '@/store'
import {LOGOUT} from '@/store/actionTypes'
import {message} from "ant-design-vue"
import router from "@/router";

const axios: AxiosInstance = request.create({
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
})

// 异常处理
const errorHandler = (error: any): any => {
    message.error(error.toString(), 12)
    return Promise.reject(error)
}

// 请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers.common['token'] = store.getters.getUserInfo.user.access_token
    return config;
}, errorHandler)

// 响应拦截器
axios.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse> | AxiosResponse => {

    if (response.data.code) {
        switch (response.data.code) {
            case 401:
                store.dispatch(LOGOUT).then()
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

export default axios
