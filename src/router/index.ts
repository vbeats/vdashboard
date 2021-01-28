import {
    createRouter,
    createWebHashHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    Router,
    RouteRecordRaw
} from 'vue-router'
import store from '@/store'
import {LOGOUT} from '@/store/actionTypes'
import NProgress from 'nprogress'
import Login from '../views/login/Login.vue'
import Layout from '../layouts/BasicLayout.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('../views/index/Index.vue')
            },
            {
                path: 'test',
                name: 'test',
                component: () => import('../views/test/Test.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*', // 404
        redirect: '/index'
    }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

/*全局路由拦截*/
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start()

    const expire: number = store.getters.getUserInfo.refresh_token_expire
    if (expire <= 0) {  // refresh_token过期
        await store.dispatch(LOGOUT).then()
        if (to.path === '/login') {
            next();
        } else {
            next({path: '/login'});
        }
    } else {
        // 存在token
        if (to.path === '/login') {
            next({path: '/index'}); // 去首页
        } else {
            next();
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router
