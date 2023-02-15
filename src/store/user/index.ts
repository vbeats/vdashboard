import {defineStore} from 'pinia'
import {User} from "./IUser";
import {useMenuStore} from "../menu"
import {logOut} from "../../api/auth/auth";

const defaultUser: User = {
    id: '',
    tenant_id: '',
    account: '',
    nick_name: '',
    phone: '',
    tenant_code: '',
    token: '',
    roles: [],
    permissions: []
}

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        ...defaultUser,
    }),

    actions: {
        async logout() {
            await logOut()
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
        saveToken(param: User) {
            this.$patch((state) => {
                Object.assign(state, param)
            })
            localStorage.setItem('user', JSON.stringify(this.$state))
        }
    },

    getters: {
        getUserInfo: (state) => state,
    },
})