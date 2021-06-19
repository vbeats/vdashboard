import {UserInfo} from "@/interface/user";
import storage from "@/utils/storage";
import {LOGOUT, UPDATE_USER_INFO} from "@/store/actionTypes";
import router from "@/router";
import {getToken} from "@/api/user";
import store from '@/store'

const checkToken = async (): Promise<void> => {
    const timer = setTimeout(checkToken, 5 * 60 * 1000)

    // user access_token refresh_token都存在的  校验有效时间  否则logout
    const user: UserInfo = storage.get('user')
    const access_token: string = storage.get('access_token')
    const refresh_token: string = storage.get('refresh_token')
    const access_token_expire: number = storage.getExpire('access_token')
    const refresh_token_expire: number = storage.getExpire('refresh_token')

    if (!user || !refresh_token || refresh_token_expire / 1000 <= 320) { // refresh_token有效时间不足一次检查周期5分钟
        clearTimeout(timer)
        await store.dispatch(LOGOUT)
        await router.replace({name: 'login'})
        return
    }

    // access_token如果到期了 刷新; 未到期, 直接用
    if (access_token && access_token_expire / 1000 >= 320) { // 剩余时间大于一次检查周期320s>5分钟
        return
    }

    // 获取新的token
    const res = await getToken({type: 0, refresh_token, platform: parseInt(import.meta.env.VITE_APP_PLATFORM)})
    await store.dispatch(UPDATE_USER_INFO, res.data)
}

export default checkToken