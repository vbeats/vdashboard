import {defineStore} from 'pinia'
import {menus} from "../../api/menu";
import _ from "lodash";

export const useMenuStore = defineStore({
    id: 'menu',
    state: () => ({
        menus: [],
        default_opens: [''],
        default_active: 'index',
        is_collapse: false,
        tabs: [],
        currentTab: ''
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
        // ---------菜单折叠
        async toggleCollapse() {
            this.$patch(state => state.is_collapse = !state.is_collapse)
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
        // ----------add tab页
        async addTab(item: any) {
            const tabs: any = this.tabs
            if (_.findIndex(tabs, (v: any) => v.id === item.id) < 0) {
                tabs.push(item)
            }
            this.$patch(state => {
                state.default_active = item.key
                state.tabs = tabs
                state.currentTab = item.id
            })
            localStorage.setItem('menu', JSON.stringify(this.$state))
        },
        async updateCurrentTab(id: any, key: string) {
            this.$patch(state => {
                state.currentTab = id
                state.default_active = key
            })
        },
        async removeTab(item: any) {
            const tabs: any = this.tabs
            _.remove(tabs, (v: any) => v.id === item.id)

            const currentTab = tabs[tabs.length - 1]

            this.$patch(state => {
                state.default_active = currentTab?.key || 'index'
                state.tabs = tabs || []
                state.currentTab = currentTab?.id || '0'
            })
            localStorage.setItem('menu', JSON.stringify(this.$state))
        }
    },

    getters: {},
})