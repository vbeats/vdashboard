import {defineStore} from 'pinia'

interface User {
    user: {
        username?: string
        phone?: string
        tenant_code?: string
        access_token?: string
        refresh_token?: string
        access_token_expire: number
        refresh_token_expire: number
    }
}

const defaultUser: User = {
    user: {
        username: '',
        phone: '',
        tenant_code: '',
        access_token: '',
        refresh_token: '',
        access_token_expire: -1,
        refresh_token_expire: -1
    }
}

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        ...defaultUser,
    }),

    actions: {
        async logout() {

        },
        async loadUserInfo() {

        }
    },

    getters: {
        getUserInfo: (state) => state.user,
    },
})