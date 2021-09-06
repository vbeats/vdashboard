import { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import store from '@/store'
import { message } from 'ant-design-vue'

export function handleRouterAuth (router: Router): void {
  /* 全局路由拦截 */
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const expire: number = store.getters.getUserInfo.access_token_expire
    if (expire - Date.now() <= 0) { // access_token过期
      await store.dispatch('logout').then()
      if (to.path === '/login') {
        next()
      } else {
        next({ path: '/login' })
      }
    } else {
      // 存在token
      await checkUserRoutes(to, from, next, store.getters.getUserInfo.user.menus || [])
    }
  })
}

// 用户路由权限校验
async function checkUserRoutes (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, menus: Array<any>) {
  if (menus.length === 0) {
    message.error('403 Forbidden', 8)
    await store.dispatch('logout').then(() => next('/login'))
    return
  }

  if (to.path === '/login') {
    next({ path: '/index' }) // 去首页
  } else {
    next()
  }
}
