import {defineStore} from 'pinia'
import {menus, topMenus} from "../../api/menu";

const indexMenu = {
    title: '首页',
    key: 'index',
    icon: 'Menu'
}
export const useMenuStore = defineStore({
    id: 'menu',
    state: () => ({
        top_menus: [indexMenu],
        menus: [],
        default_opens: [''],
        default_active: 'index',
        is_collapse: false
    }),

    actions: {
        // 初始化菜单数据
        async loadMenu() {
            const initValue = localStorage.getItem('menu')
            const menuInfo = initValue ? JSON.parse(initValue) : this.$state
            this.$patch({...menuInfo, is_collapse: false})
        },
        // 更新菜单数据
        async updateMenu() {
            const topMenuRes = await topMenus()
            const menuRes = await menus()
            this.$patch(state => {
                state.menus = menuRes.data
                state.top_menus = topMenuRes.data || [indexMenu]
            })
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
        // 更新左侧菜单
        async updateSideMenu(menus: any) {
            this.$patch(state => {
                state.menus = menus
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