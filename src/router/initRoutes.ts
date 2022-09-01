import {RouteRecordRaw} from 'vue-router'
import Layout from '../layout/BasicLayout.vue'
import Index from '../pages/index/index.vue'
import Profile from '../components/profile/index.vue'
import router from "./index"
import {Menu} from "../store/menu/IMenu"
import {useMenuStore} from "../store/menu"

export default async function (): Promise<void> {

    const childrenRoutes = await childrenRoute()

    childrenRoutes.unshift(
        {
            path: '/index',
            name: 'index',
            component: Index,
            meta: {
                title: '首页',
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {
                title: '个人信息',
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
async function childrenRoute(): Promise<RouteRecordRaw[]> {
    const menus: Array<Menu> = useMenuStore().menus || []
    const routes = new Array<RouteRecordRaw>()

    const modules = import.meta.glob('../pages/**/index.vue')

    menus &&
    menus.length >= 1 &&
    menus.forEach((item: Menu) => {
        if (item.children && item.children.length >= 1) {
            item.children.forEach((child: Menu) => {
                routes.push({
                    path: item.path + child.path,
                    name: child.key,
                    component: modules[`../pages${item.path + child.path}/index.vue`],
                    meta: {
                        title: child.title,
                        buttons: child.children,
                    },
                })
            })
        } else {
            routes.push({
                path: item.path,
                name: item.key,
                component: modules[`../pages${item.path}/index.vue`],
                meta: {
                    title: item.title,
                    buttons: item.buttons,
                },
            })
        }
    })
    return routes
}