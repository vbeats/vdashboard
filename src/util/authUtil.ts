import router from '@/router'
import store from '@/store'
import dayjs from 'dayjs'
import {getToken, getUserProfile} from '@/api/auth'

// 校验token
const checkToken = async (): Promise<void> => {
  const timer = setTimeout(checkToken, 5 * 60 * 1000)
  const user = store.getters.getUserInfo

  // login access_token refresh_token都存在的  校验有效时间  否则logout
  const access_token: string = user.access_token || ''
  const refresh_token: string = user.refresh_token || ''
  const access_token_expire: number = parseInt(user.access_token_expire || '-1')
  const refresh_token_expire: number = parseInt(user.refresh_token_expire || '-1')
  const now = dayjs().unix()

  if (!user || access_token === '' || refresh_token_expire - now <= 320) {
    // refresh_token有效时间不足一次检查周期5分钟
    clearTimeout(timer)
    await store.dispatch('logout')
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
    tenant_code: user.tenant_code,
    client_id: process.env.VUE_APP_CLIENTID,
    secret: process.env.VUE_APP_SECRET,
    refresh_token,
    grant_type: 'REFRESH_TOKEN',
    platform: process.env.VUE_APP_PLATFORM,
  })
  await store.dispatch('update_userinfo', {...res.data})

  await loadUserProfile()
}

// 用户基本信息 菜单...
const loadUserProfile = async () => {
  const res = await getUserProfile()
  await store.dispatch('update_userinfo', res.data)
}

// 检查当前页面有某些action权限 (route.meta.action)
const checkPerms = (actions: Array<string>, action: string): boolean => {
  return actions.indexOf(action) >= 0
}

export {checkToken, loadUserProfile, checkPerms}
