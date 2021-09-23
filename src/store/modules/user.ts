import initRoutes from '@/router/initRoutes'

const state = {
  user: {
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
  update_userinfo: (state: any, userInfo: any): void => {
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
