import dayjs from 'dayjs'
import {useUserStore} from "../store/user";
import router from "../router";
import {getToken} from "../api/auth/auth";
import {useMenuStore} from "../store/menu";

// 校验token
const checkToken = async (): Promise<void> => {
    const timer = setTimeout(checkToken, 5 * 60 * 1000)
    const userStore = useUserStore()
    const userInfo = userStore.getUserInfo

    // login access_token refresh_token都存在的  校验有效时间  否则logout
    const access_token: string = userInfo.access_token || ''
    const refresh_token: string = userInfo.refresh_token || ''
    const access_token_expire: number = userInfo.access_token_expire || -1
    const refresh_token_expire: number = userInfo.refresh_token_expire || -1
    const now = dayjs().unix()

    if (!userInfo || access_token === '' || refresh_token_expire - now <= 320) {
        // refresh_token有效时间不足一次检查周期5分钟
        clearTimeout(timer)
        await userStore.logout()
        await router.replace({name: 'login'})
        return
    }

    // access_token如果到期了 刷新; 未到期, 直接用
    if (access_token !== '' && access_token_expire - now >= 320) {
        // 剩余时间大于一次检查周期320s>5分钟
        return
    }

    // 刷新token
    const res = await getToken({
        tenant_code: userInfo.tenant_code,
        refresh_token,
        grant_type: 'refresh_token',
    })
    await userStore.updateAccessToken({...res.data})

    await loadUserProfile()
}

// 用户基本信息 菜单...
const loadUserProfile = async () => {
    const menuStore = useMenuStore()
    const userStore = useUserStore()

    await userStore.getProfile()
    await menuStore.updateMenu()
}

export {checkToken}