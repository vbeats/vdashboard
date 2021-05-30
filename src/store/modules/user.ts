import storage from '@/utils/storage'
import {LOAD_USER_INFO, LOGOUT, UPDATE_USER_INFO} from '../actionTypes'
import {UserInfo} from "@/interface/user"
import {SUser} from "@/store/interface"
import initRoutes from "@/router/initRoutes";

class DefaultUser implements UserInfo {
    user_id = 0
    access_token = ''
    refresh_token = ''
    username = ''
    role_id = 0
    phone = ''
    avatar = ''
    tenant_id = 0
    menus = []
}

class defaultState implements SUser {
    access_token_expire = -1;
    refresh_token_expire = -1; // 过期时间 毫秒时间戳
    user = new DefaultUser();
}

const state: SUser = new defaultState()


const user: any = {
    [LOGOUT]: (state: SUser): void => {
        state.user = new DefaultUser()
        state.access_token_expire = -1
        state.refresh_token_expire = -1
        storage.remove('user')
        storage.remove('access_token')
        storage.remove('refresh_token')
    },
    [UPDATE_USER_INFO]: (state: SUser, userInfo: UserInfo): void => {
        const accessTokenExpire = new Date().getTime() + 7200 * 1000
        const refreshTokenExpire = new Date().getTime() + 20 * 24 * 3600 * 1000
        state.user = {...userInfo}
        state.access_token_expire = accessTokenExpire
        state.refresh_token_expire = refreshTokenExpire
        storage.set('user', state.user)
        storage.set('access_token', userInfo.access_token, accessTokenExpire)
        storage.set('refresh_token', userInfo.refresh_token, refreshTokenExpire)
        initRoutes()
    },
    [LOAD_USER_INFO]: (state: SUser): void => {
        const user: UserInfo = storage.get('user')
        const access_token_expire: number = storage.getExpire('access_token')
        const refresh_token_expire: number = storage.getExpire('refresh_token')
        state.user = user || new DefaultUser()

        state.access_token_expire = access_token_expire
        state.refresh_token_expire = refresh_token_expire
        initRoutes()
    }
}

export default {
    state,
    mutations: user,
};
