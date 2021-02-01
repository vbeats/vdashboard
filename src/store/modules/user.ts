import storage from '@/utils/storage'
import {LOAD_USER_INFO, LOGOUT, UPDATE_TOKEN} from '../actionTypes'
import {Token} from "@/interface"
import {SUser} from "@/store/interface"

class DefaultUser implements Token {
    user_id = 0
    access_token = ''
    refresh_token = ''
    username = ''
    nickname = ''
    roles = ''
    phone = ''
    avatar = ''
    expires = -1;
    tenant_code = ''
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
    [UPDATE_TOKEN]: (state: SUser, token: Token): void => {
        const accessTokenExpire = new Date().getTime() + 7200 * 1000
        const refreshTokenExpire = new Date().getTime() + 20 * 24 * 3600 * 1000
        state.user = {...token}
        state.access_token_expire = accessTokenExpire
        state.refresh_token_expire = refreshTokenExpire
        storage.set('user', state.user)
        storage.set('access_token', token.access_token, accessTokenExpire)
        storage.set('refresh_token', token.refresh_token, refreshTokenExpire)
    },
    [LOAD_USER_INFO]: (state: SUser): void => {
        const user: Token = storage.get('user')
        const access_token_expire: number = storage.getExpiration('access_token') || -1
        const refresh_token_expire: number = storage.getExpiration('refresh_token') || -1

        state.user = user || new DefaultUser()
        state.access_token_expire = access_token_expire
        state.refresh_token_expire = refresh_token_expire
    }
}

export default {
    state,
    mutations: user,
};
