import {RouteRecordRaw} from 'vue-router'
import store from '@/store'
import router from '@/router'
import Layout from '@/layout/BasicLayout.vue'

export default function (): void {
  const childrenRoutes = childrenRoute()
  // 测试模块
  childrenRoutes.push(
    {
      path: '/test/map',
      name: 'map',
      component: () => import(`../views/test/Map.vue`),
    },
    {
      path: '/test/amap',
      name: 'amap',
      component: () => import(`../views/test/AMap.vue`),
    }
  )
  router.addRoute({
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: childrenRoutes[1].path,
    children: childrenRoutes,
  })
}

// 子路由
function childrenRoute(): RouteRecordRaw[] {
  const menus: Array<any> = store.getters.getUserInfo.menus
  const routes = new Array<RouteRecordRaw>()
  menus &&
    menus.length >= 1 &&
    menus.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((child: any) => addRoute(item.key, item.title, child, routes))
      } else {
        addRoute(item.key, '', item, routes)
      }
    })
  return routes
}

function addRoute(prefix: string, pTitle: string, item: any, routes: Array<RouteRecordRaw>): void {
  routes.push({
    path: item.path,
    name: item.key,
    component: () => import(`../views/${prefix}/${item.key[0].toUpperCase() + item.key.substring(1, item.key.length)}.vue`),
    meta: {
      title: item.title,
      breads: pTitle + '_' + item.title,
      actions: item.action && item.action.split(',').filter((v: string) => v && v !== ''),
    },
  })
}
