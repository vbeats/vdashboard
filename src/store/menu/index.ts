import {defineStore} from 'pinia'
import {menus, topMenus} from "../../api/menu";

export const useMenuStore = defineStore({
    id: 'menu',
    state: () => ({
        top_menu: undefined,
        menus: undefined
    }),

    actions: {
        // 初始化菜单数据
        async initMenu() {
            const topMenuRes = await topMenus()
            const menuRes = await menus()
            console.log(topMenuRes, menuRes)
        }
    },

    getters: {},
})