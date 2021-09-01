import router from '@/router'
import { getToken } from '@/api/auth'
import store from '@/store'

const checkToken = async (): Promise<void> => {
  const timer = setTimeout(checkToken, 5 * 60 * 1000)
  const userInfo = store.getters.getUserInfo

  // login access_token refresh_token都存在的  校验有效时间  否则logout
  const user = userInfo.user
  const access_token: string = userInfo.user.access_token || ''
  const refresh_token: string = userInfo.user.refresh_token || ''
  const access_token_expire: number = parseInt(userInfo.access_token_expire || '-1')
  const refresh_token_expire: number = parseInt(userInfo.refresh_token_expire || '-1')
  const now = Date.now()

  if (!user || access_token === '' || (refresh_token_expire - now) / 1000 <= 320) { // refresh_token有效时间不足一次检查周期5分钟
    clearTimeout(timer)
    await store.dispatch('logout')
    await router.replace({ name: 'login' })
    return
  }

  // access_token如果到期了 刷新; 未到期, 直接用
  if (access_token !== '' && (access_token_expire - now) / 1000 >= 320) { // 剩余时间大于一次检查周期320s>5分钟
    return
  }

  // 获取新的token
  const res = await getToken({
    type: 0,
    refresh_token,
    platform: parseInt(process.env.VUE_APP_PLATFORM)
  })
  await store.dispatch('update_userinfo', res.data)
}

export default checkToken
