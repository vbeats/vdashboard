import {useUserStore} from "../store/user"
import dayjs from "dayjs"
import {refreshToken} from "../api/auth/auth"
import router from "../router"

const checkToken = async () => {

    const timer = setTimeout(checkToken, 5 * 60 * 1000)

    const userStore = useUserStore()
    const user = userStore.getUserInfo


    // login token存在的  校验有效时间  否则logout
    const token: string = user.token || ''
    const expire: number = user.expire || -1
    const now = dayjs().unix()

    // token过期
    if (!user || token === '' || expire - now <= 0) {
        clearTimeout(timer)
        await userStore.logout()
        await router.replace({name: 'login'})
        return
    }

    // token如果到期了 刷新; 未到期, 剩余时间大于一次检查周期320s>5分钟 直接用
    if (token !== '' && expire - now >= 320) {
        return
    }

    // token存在 过期时间小于5分钟  刷新token有效期
    const res = refreshToken({grantType: 'password', merchantCode: user.merchantCode})
    await userStore.refreshToken()
}

export {checkToken}