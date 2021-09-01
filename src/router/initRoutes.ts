import { RouteRecordRaw } from 'vue-router'
import store from '@/store'
import router from '@/router'
import Layout from '@/layout/BasicLayout.vue'

export default function (): void {
  const childrenRoutes = childrenRoute()
  router.addRoute({
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/index',
    children: childrenRoutes
  })
}

// 子路由
function childrenRoute (): RouteRecordRaw[] {
  const menus: Array<any> = store.getters.getUserInfo.user.menus
  const routes = new Array<RouteRecordRaw>()
  menus && menus.length >= 1 &&
  menus.forEach(item => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((child: any) => addRoute(item.key, child, routes))
    } else {
      addRoute(item.key, item, routes)
    }
  })

  return routes
}

function addRoute (prefix: string, item: any, routes: Array<RouteRecordRaw>): void {
  routes.push({
    path: item.path,
    name: item.key,
    component: () => import(`../views/${prefix}/${item.key[0].toUpperCase() + item.key.substring(1, item.key.length)}.vue`),
    meta: {
      title: item.title
    }
  })
}
