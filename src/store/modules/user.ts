import initRoutes from '@/router/initRoutes'
import { getToken } from '@/api/auth'

const state = {
  user: {
    id: '',
    access_token: '',
    refresh_token: '',
    username: '',
    phone: '',
    avatar: '',
    menus: []
  },
  access_token_expire: -1,
  refresh_token_expire: -1
}

const updateUserInfo = (state:any, userInfo:any) => {
  const access_token_expire = new Date().getTime() + 7200 * 1000
  const refresh_token_expire = new Date().getTime() + 180 * 24 * 3600 * 1000
  state.user = { ...userInfo }
  state.access_token_expire = access_token_expire
  state.refresh_token_expire = refresh_token_expire
  localStorage.setItem('user', JSON.stringify(userInfo))
  localStorage.setItem('access_token', userInfo.access_token)
  localStorage.setItem('refresh_token', userInfo.refresh_token)
  localStorage.setItem('access_token_expire', String(access_token_expire))
  localStorage.setItem('refresh_token_expire', String(refresh_token_expire))
  initRoutes()
}

const user: any = {
  logout: (state: any): void => {
    state.user = {}
    state.access_token_expire = -1
    state.refresh_token_expire = -1
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access_token_expire')
    localStorage.removeItem('refresh_token_expire')
  },
  refresh_token: async (state: any): Promise<void> => {
    const res = await getToken({
      type: 0,
      refresh_token: state.user.refresh_token,
      platform: parseInt(process.env.VUE_APP_PLATFORM)
    })
    updateUserInfo(state, res.data)
  },
  update_userinfo: (state: any, userInfo:any): void => {
    updateUserInfo(state, userInfo)
  },
  load_userinfo: (state: any): void => {
    const user = localStorage.getItem('user')
    const access_token_expire: number = parseInt(localStorage.getItem('access_token_expire') || '-1')
    const refresh_token_expire: number = parseInt(localStorage.getItem('refresh_token_expire') || '-1')
    state.user = user ? JSON.parse(user) : {}

    state.access_token_expire = access_token_expire
    state.refresh_token_expire = refresh_token_expire
    initRoutes()
  }
}

export default {
  state,
  mutations: user
}
