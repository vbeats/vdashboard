import {createRouter, createWebHashHistory, Router, RouteRecordRaw} from 'vue-router'
import Login from '../pages/login/index.vue'
import {handleRouterAuth} from './routerHooks'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/:pathMatch(.*)*', // 404
        name: 'NotFound',
        redirect: '/index'
    },
]
const router: Router = createRouter({
    history: createWebHashHistory(),
    routes,
})

handleRouterAuth(router)

export default router