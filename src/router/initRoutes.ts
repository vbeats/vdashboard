import {RouteRecordRaw} from 'vue-router'
import Layout from '../layout/BasicLayout.vue'
import router from "./index"
import {Menu} from "../store/menu/IMenu";
import {useMenuStore} from "../store/menu";

export default function (): void {

    const childrenRoutes = childrenRoute()

    childrenRoutes.unshift(
        {
            path: '/index',
            name: 'index',
            component: import.meta.glob('../pages/index/index.vue'),
            meta: {
                title: '首页',
            }
        }
    )

    router.addRoute({
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: '/index',
        children: childrenRoutes,
    })

}

// 子路由
function childrenRoute(): RouteRecordRaw[] {
    const menus: Array<Menu> = useMenuStore().menus || []
    const routes = new Array<RouteRecordRaw>()

    const modules = import.meta.glob('../pages/**/*.vue')

    menus &&
    menus.length >= 1 &&
    menus.forEach((item: Menu) => {
        routes.push({
            path: item.path,
            name: item.key,
            component: import.meta.glob('../pages' + item.path + '/index.vue'),
            meta: {
                title: item.title,
                buttons: item.buttons,
            },
        })
    })
    return routes
}