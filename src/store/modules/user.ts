import router from "@/router"
import storage from '@/utils/storage'

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
    toLogin: (state: any): void => {
        storage.remove('user')
        state.user = {}
        router.replace('/login').then()
    },
}

export default {
    state,
    mutations: user,
};
