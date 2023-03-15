import {defineStore} from 'pinia'
import {User} from "./IUser";
import {useMenuStore} from "../menu"
import dayjs from "dayjs";

const defaultUser: User = {
    id: '',
    merchantId: '',
    account: '',
    nickName: '',
    phone: '',
    merchantCode: '',
    token: '',
    expire: -1,
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
            const merchantCode = this.merchantCode
            this.$reset()
            this.merchantCode = merchantCode
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
                Object.assign(state, {...param, expire: dayjs().unix() + 4 * 3600})
            })
            localStorage.setItem('user', JSON.stringify(this.$state))
        },
        // 刷新token过期时间
        refreshToken() {
            this.$patch(state => {
                state.expire = dayjs().unix() + 4 * 3600
            })
            localStorage.setItem('user', JSON.stringify(this.$state))
        }
    },

    getters: {
        getUserInfo: (state) => state,
    },
})