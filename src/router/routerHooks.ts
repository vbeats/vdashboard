import {NavigationGuardNext, RouteLocationNormalized, Router} from 'vue-router'
import {useUserStore} from '../store/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {useMerchantStore} from "../store/merchant";

export function handleRouterAuth(router: Router): void {
    /* 全局路由拦截 */
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        NProgress.start()
        const userStore = useUserStore()
        const useStorage = localStorage.getItem("user")
        const token = userStore.token || (useStorage ? JSON.parse(useStorage).token : '')
        if (!token || token === '') {
            await userStore.logout()
            if (to.path === '/login') {
                next()
            } else {
                next({path: '/login'})
            }
        } else {
            useMerchantStore().reset()
            // 存在token
            next()
        }
    })

    router.afterEach(() => {
        NProgress.done()
    })
}