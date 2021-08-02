import {RouteRecordRaw} from "vue-router";
import store from '@/store'
import {Menu} from "@/interface/user";
import storage from '@/utils/storage'
import router from '@/router'
import Layout from "@/layouts/BasicLayout.vue";

export default function (): void {
    const childrenRoutes = childrenRoute()
    router.addRoute({
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: childrenRoutes[0],
        children: childrenRoutes
    })
}

// 子路由
function childrenRoute(): RouteRecordRaw[] {

    const menus: Array<Menu> = storage.get('user')?.menus || store.getters.getUserInfo.user.menus
    let routes = new Array<RouteRecordRaw>()
    const modules = import.meta.glob('../views/**/*.vue')

    menus && menus.length >= 1 &&
    menus.forEach(item => {
        if (item.children && item.children.length > 0) {
            item.children.forEach(child => addRoute(item.key, child, modules, routes))
        } else {
            addRoute(item.key, item, modules, routes)
        }
    })

    return routes
}

function addRoute(path: string, item: Menu, modules: Record<string,
    () => Promise<{
        [key: string]: any
    }>>, routes: Array<RouteRecordRaw>): void {
    const absolutePath = `../views/${path}/${item.key[0].toUpperCase() + item.key.substring(1, item.key.length)}.vue`

    routes.push({
        path: '/' + item.key,
        name: item.key,
        component: modules[absolutePath],
        meta: {title: item.title, permissions: item.permissions}
    })
}