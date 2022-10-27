import {defineStore} from 'pinia'
import {Token, User} from "./IUser";
import {profile} from "../../api/auth/auth"
import {useMenuStore} from "../menu";

const defaultUser: User = {
    id: '',
    tenant_id: '',
    username: '',
    phone: '',
    tenant_code: '',
    token: '',
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
            const menuStore = useMenuStore()
            menuStore.$reset()
            localStorage.setItem('menu', JSON.stringify(menuStore.$state))
        },
        loadUserInfo() {
            const initValue = localStorage.getItem('user')
            const userInfo = initValue ? JSON.parse(initValue) : this.$state
            this.$patch({...userInfo})
        },
        // login 保存token
        saveToken(param: Token) {
            this.$patch((state) => {
                state.id = param.id
                state.tenant_id = param.tenant_id
                state.tenant_code = param.tenant_code
                state.token = param.token
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