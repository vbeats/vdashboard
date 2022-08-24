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
        if (!userStore.user.access_token_expire || userStore.user.access_token_expire - dayjs().unix() <= 0) {
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