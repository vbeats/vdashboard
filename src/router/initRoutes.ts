import {RouteRecordRaw} from 'vue-router'
import Layout from '../layout/BasicLayout.vue'
import router from "./index"
import {Menu} from "../store/menu/IMenu"
import {useMenuStore} from "../store/menu"

const Index = import.meta.glob('../pages/index/index.vue')['../pages/index/index.vue']
const Profile = import.meta.glob('../components/profile/index.vue')['../components/profile/index.vue']
const OpenItems = import.meta.glob('../pages/system/open/OpenItem.vue')['../pages/system/open/OpenItem.vue']

export default function (): void {

    const childrenRoutes = childrenRoute()

    // ---------公共route

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

    //  ---------不在后端Menu中的route
    childrenRoutes.push(
        {
            path: '/open/items/:id',
            name: 'openItems',
            component: OpenItems,
            meta: {
                title: '授权应用'
            },
            props: true
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
    let menus: Array<Menu> = useMenuStore().menus || []
    if (!menus || menus.length === 0) {
        const menuStorage = localStorage.getItem('menu')
        menus = menuStorage ? JSON.parse(menuStorage).menus : []
    }
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