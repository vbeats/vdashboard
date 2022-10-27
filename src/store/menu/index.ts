import {defineStore} from 'pinia'
import {menus} from "../../api/menu";

export const useMenuStore = defineStore({
    id: 'menu',
    state: () => ({
        menus: [],
        default_opens: [''],
        default_active: 'index',
        is_collapse: false,
        path: '/index'
    }),

    actions: {
        // 初始化菜单数据
        loadMenu() {
            const initValue = localStorage.getItem('menu')
            const menuInfo = initValue ? JSON.parse(initValue) : this.$state
            this.$patch({...menuInfo, is_collapse: false})
        },
        // 更新菜单数据
        async updateMenu() {
            const menuRes = await menus()
            this.$patch(state => {
                state.menus = menuRes.data
            })
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
        // -----------------更新菜单状态
        async updateDefaultOpens(defaultOpens: string[]) {
            this.$patch(state => state.default_opens = defaultOpens)
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
        async updateDefaultActive(defaultActive: string) {
            this.$patch(state => state.default_active = defaultActive)
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
        // ---------菜单折叠
        async toggleCollapse() {
            this.$patch(state => state.is_collapse = !state.is_collapse)
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
    },

    getters: {},
})