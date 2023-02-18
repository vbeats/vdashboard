import {defineStore} from 'pinia'

export const useTenantStore = defineStore({
    id: 'tenant',
    state: () => ({
        show: true,
        tenantId: '',
        tenantName: ''
    }),

    actions: {
        update(param: any) {
            this.$patch({...param})
        }
    },

    getters: {
        tenantState: (state) => state
    },
})