import {NavigationGuardNext, RouteLocationNormalized, Router} from 'vue-router'
import {useUserStore} from '../store/user'
import dayjs from 'dayjs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function handleRouterAuth(router: Router): void {
    /* 全局路由拦截 */
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        NProgress.start()
        const userStore = useUserStore()
        const useStorage = localStorage.getItem("user")
        const access_token = userStore.access_token || (useStorage ? JSON.parse(useStorage).access_token : '')
        const access_token_expire = userStore.access_token_expire || (useStorage ? JSON.parse(useStorage).access_token_expire : -1)
        if (!access_token || access_token === '' || !access_token_expire || access_token_expire - dayjs().unix() <= 0) {
            // access_token过期
            await userStore.logout()
            if (to.path === '/login') {
                next()
            } else {
                next({path: '/login'})
            }
        } else {
            // 存在token
            next()
        }
    })

    router.afterEach(() => {
        NProgress.done()
    })
}