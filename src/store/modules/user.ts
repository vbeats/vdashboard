import storage from '@/utils/storage'
import * as types from '../actionTypes'
import {Token} from "@/interface"

const state: any = {
    user: {
        user_id: 0,
        access_token: '',
        refresh_token: '',
        username: '',
        nickname: '',
        roles: '',
        phone: '',
        avatar: ''
    }
}

const user: any = {
    [types.LOGOUT]: (state: any): void => {
        storage.remove('user')
        storage.remove('access_token')
        storage.remove('refresh_token')
        state.user = {}
    },
    [types.UPDATE_TOKEN]: (state: any, token: Token): void => {
        state.user = {...token}
        storage.set('user', state.user)
        storage.set('access_token', token.access_token, new Date().getTime() + 7200 * 1000)
        storage.set('refresh_token', token.refresh_token, new Date().getTime() + 20 * 24 * 3600 * 1000)
    }
}

export default {
    state,
    mutations: user,
};
