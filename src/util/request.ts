import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {useUserStore} from "../store/user";
import router from "../router";
import {storeToRefs} from "pinia";
import {ElMessage} from 'element-plus'
import dayjs from "dayjs"

const queue = new Map()

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
})

// 异常处理
const errorHandler = (error: any): any => {
    ElMessage({message: error.toString(), type: 'error'})
    return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use((config: AxiosRequestConfig): any => {

    const abortController = new AbortController()
    const userStore = storeToRefs(useUserStore())
    config.headers && (config.headers['Authorization'] = 'Bearer ' + userStore.token?.value)
    config.headers && (config.headers['X-User-Id'] = userStore.id?.value || '')
    config.headers && (config.headers['X-Tenant-Id'] = userStore.tenant_id?.value || '')

    const q = queue.get(config.url)
    if (q && dayjs().unix() - q < 5) {
        abortController.abort()
        throw new Error('Cancel')
    }
    queue.set(config.url, dayjs().unix())
    config.signal = abortController.signal

    return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse> | AxiosResponse => {

    queue.delete(response.config.url)

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