import {defineStore} from 'pinia'
import {Token, User} from "./IUser";
import dayjs from "dayjs";
import {parseInt} from "lodash";
import {profile} from "../../api/auth/auth";

const defaultUser: User = {
    id: '',
    tenant_id: '',
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
            const tenant_code = this.tenant_code
            this.$reset()
            this.tenant_code = tenant_code
            localStorage.setItem('user', JSON.stringify(this.$state))
        },
        loadUserInfo() {
            const initValue = localStorage.getItem('user')
            const userInfo = initValue ? JSON.parse(initValue) : this.$state
            this.$patch({...userInfo})
        },
        // login 保存token
        saveToken(param: Token) {
            const now = dayjs().unix()
            this.$patch((state) => {
                state.id = param.id
                state.tenant_id = param.tenant_id
                state.tenant_code = param.tenant_code
                state.access_token = param.access_token
                state.refresh_token = param.refresh_token
                state.access_token_expire = now + parseInt(import.meta.env.VITE_ACCESS_TOKEN_EXPIRE)
                state.refresh_token_expire = now + parseInt(import.meta.env.VITE_REFRESH_TOKEN_EXPIRE) * 24 * 3600
            })
            localStorage.setItem('user', JSON.stringify(this.$state))
        },
        // 只更新 access_token
        updateAccessToken(param: Token) {
            const now = dayjs().unix()
            this.$patch((state) => {
                state.id = param.id
                state.tenant_id = param.tenant_id
                state.access_token = param.access_token
                state.access_token_expire = now + parseInt(import.meta.env.VITE_ACCESS_TOKEN_EXPIRE)
            })
            localStorage.setItem('user', JSON.stringify(this.$state))
        },
        // 个人信息
        async getProfile() {
            const res = await profile()
            this.$patch(state => {
                state.username = res.data.username || ''
                state.phone = res.data.phone || ''
            })
            localStorage.setItem('user', JSON.stringify(this.$state))
        }
    },

    getters: {
        getUserInfo: (state) => state,
    },
})