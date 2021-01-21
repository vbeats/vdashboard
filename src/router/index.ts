import {
    createRouter,
    createWebHashHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    Router,
    RouteRecordRaw
} from 'vue-router'
import NProgress from 'nprogress'
import storage from '../utils/storage'
import Base from '../views/base/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Base
    }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

/*全局路由拦截*/
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start()
    console.log(to, from, next)
    console.log(storage)
    const user = storage.get('test')
    console.log(user)

    storage.set('xx', 'oo', new Date().getTime() + 3000)

    setTimeout(() => {
        console.log(storage.get('xx'))
        next()
    }, 4000)
    // next()
    /*const user = localStorage.getItem('user') || '';
    if (user === '' || (new Date().getTime() - user.time) <= 5 * 24 * 3600 * 1000) {  // 上次登录获取到的refresh_token最长7天有效
        localStorage.removeItem('user');
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
    }*/
});

router.afterEach(() => {
    NProgress.done()
})

export default router
