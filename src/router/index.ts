import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import Login from '../views/login/Login.vue'
import { handleRouterAuth } from './routerAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*', // 404
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '../views/error/404.vue')
  }
]
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
})

handleRouterAuth(router)

export default router
