import {defineStore} from 'pinia'
import {Token, User} from "./IUser";
import dayjs from "dayjs";
import {useLocalStorage} from "@vueuse/core";

const defaultUser: User = {
    username: '',
    phone: '',
    tenant_code: '',
    access_token: '',
    refresh_token: '',
    access_token_expire: -1,
    refresh_token_expire: -1
}

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        ...defaultUser,
    }),

    actions: {
        async logout() {
            const tenant_code = this.$state.tenant_code
            this.$reset()
            useLocalStorage('user', {...this.$state, tenant_code})
        },
        async loadUserInfo() {
            const userInfo = useLocalStorage('user', {...defaultUser})
            this.$patch({...userInfo.value})
        },
        // login 保存token
        async saveToken(param: Token) {
            const now = dayjs().unix()
            this.$patch({
                ...this.$state, ...param,
                access_token_expire: now + import.meta.env.VITE_ACCESS_TOKEN_EXPIRE,
                refresh_token_expire: now + import.meta.env.VITE_REFRESH_TOKEN_EXPIRE * 24 * 3600
            })

            // storage
            useLocalStorage('user', {...this.$state})
        },
        // 只更新 access_token
        async updateAccessToken(param: Token) {
            const now = dayjs().unix()
            this.$patch({
                ...this.$state, ...param, access_token_expire: now + import.meta.env.VITE_ACCESS_TOKEN_EXPIRE,
            })

            // update storage
            useLocalStorage('user', {...this.$state})
        }
    },

    getters: {
        getUserInfo: (state) => state,
    },
})