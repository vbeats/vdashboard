import {defineStore} from 'pinia'

export const useTenantStore = defineStore({
    id: 'tenant',
    state: () => ({
        show: true,
        tenant_id: '',
        tenant_name: ''
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