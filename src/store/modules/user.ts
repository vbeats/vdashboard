import {useLocalStorage} from '@vueuse/core'
import dayjs from 'dayjs'
import {UserInfo} from '@/store/interface/UserInfo'
import initRoutes from '@/router/initRoutes'
import {mapToState} from '@/util/util'

const defaultUser: UserInfo = {
  tenant_code: process.env.VUE_APP_SHOW_TENANT === 'true' ? '' : process.env.VUE_APP_TENANT,
  tenant_id: '0',
  type: 0,
  account: '',
  nick_name: '',
  gender: '',
  phone: '',
  access_token: undefined,
  refresh_token: undefined,
  access_token_expire: -1,
  refresh_token_expire: -1,
  menus: undefined,
}

const state = {
  ...defaultUser,
}

const user: any = {
  // 加载用户信息
  load_userinfo: (state: any) => {
    const user = useLocalStorage('user', defaultUser)
    mapToState(user.value, state)
    // menus
    user.value.menus && initRoutes()
  },
  // token && 用户信息
  update_userinfo: (state: any, info: UserInfo) => {
    mapToState(info, state)
    if (info.access_token && info.refresh_token) {
      state.access_token_expire = dayjs().unix() + 7200
      state.refresh_token_expire = dayjs().unix() + 30 * 24 * 3600
    }
    localStorage.removeItem('user')
    useLocalStorage('user', {...state})
    // menus
    info.menus && initRoutes()
  },
  // 退出登录
  logout: (state: any) => {
    mapToState(defaultUser, state)
    localStorage.removeItem('user')
  },
}

export default {
  state,
  mutations: user,
}
