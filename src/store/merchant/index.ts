import {defineStore} from 'pinia'

export const useMerchantStore = defineStore({
    id: 'merchant',
    state: () => ({
        show: true,
        merchantId: '',
        merchantName: ''
    }),

    actions: {
        update(param: any) {
            this.$patch({...param})
        },
        reset() {
            this.$reset()
        }
    },

    getters: {
        merchantState: (state) => state
    },
})