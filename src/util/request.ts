import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {useUserStore} from "../store/user";
import router from "../router";
import {storeToRefs} from "pinia";
import {ElMessage} from 'element-plus'

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 6000,
})

// 异常处理
const errorHandler = (error: any): any => {
    ElMessage({message: error.toString(), type: 'error'})
    return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use((config: AxiosRequestConfig) => {
    const userStore = storeToRefs(useUserStore())
    config.headers && (config.headers.Authorization = 'Bearer ' + userStore.access_token)
    return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse> | AxiosResponse => {
    if (response.data.code) {
        switch (response.data.code) {
            case 401:
                useUserStore().logout().then(() => {
                    router.replace({name: 'login'}).then()
                })
                break
            case 200:
                return response.data
            default:
                ElMessage({message: response.data.msg, type: 'error', duration: 8000})
        }
        throw new Error()
    }

    return response
}, errorHandler)

export default request