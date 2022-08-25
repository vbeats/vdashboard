import {defineStore} from 'pinia'

export const useMenuStore = defineStore({
    id: 'menu',
    state: () => ({
        top_menu: undefined,
        menus: undefined
    }),

    actions: {},

    getters: {},
})