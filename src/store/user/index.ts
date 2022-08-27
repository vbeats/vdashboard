import {defineStore} from 'pinia'
import {Token, User} from "./IUser";
import dayjs from "dayjs";
import {useStorage} from "@vueuse/core";

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
            this.access_token = ''
            this.refresh_token = ''
            this.access_token_expire = -1
            this.refresh_token_expire = -1
        },
        async loadUserInfo() {
            const userInfo = useStorage('user', this.$state)
            this.$patch({...userInfo.value})
        },
        // login 保存token
        async saveToken(param: Token) {
            const now = dayjs().unix()
            this.$patch((state) => {
                state.tenant_code = param.tenant_code
                state.access_token = param.access_token
                state.refresh_token = param.refresh_token
                state.access_token_expire = now + import.meta.env.VITE_ACCESS_TOKEN_EXPIRE,
                    state.refresh_token_expire = now + import.meta.env.VITE_REFRESH_TOKEN_EXPIRE * 24 * 3600

            })
        },
        // 只更新 access_token
        async updateAccessToken(param: Token) {
            const now = dayjs().unix()
            this.$patch((state) => {
                state.access_token = param.access_token
                state.access_token_expire = now + import.meta.env.VITE_ACCESS_TOKEN_EXPIRE
            })
        }
    },

    getters: {
        getUserInfo: (state) => state,
    },
})