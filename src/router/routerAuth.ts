import {NavigationGuardNext, RouteLocationNormalized, Router} from "vue-router";
import NProgress from "nprogress";
import store from "@/store";
import {LOGOUT} from "@/store/actionTypes";
import {Menu} from "@/interface/user";
import {message} from 'ant-design-vue'

export function handleRouterAuth(router: Router): void {

    /*全局路由拦截*/
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        NProgress.start()

        const expire: number = store.getters.getUserInfo.access_token_expire
        if (expire <= 0) {  // access_token过期
            await store.dispatch(LOGOUT).then()
            if (to.path === '/login') {
                next();
            } else {
                next({path: '/login'});
            }
        } else {
            // 存在token
            checkUserRoutes(to, from, next, store.getters.getUserInfo.user.menus || [])
        }
    })

    router.afterEach(() => {
        NProgress.done()
    })
}

// 用户路由权限校验
function checkUserRoutes(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, menus: Array<Menu>) {
    if (menus.length === 0) {
        message.error('403 Forbidden', 8)
        return
    }

    if (to.path === '/login') {
        next({path: '/index'}); // 去首页
    } else {
        next();
    }
}