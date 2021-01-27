<template>
  <a-layout class="base-layout">
    <a-drawer v-if="showDrawerMenu"
              :closable="false"
              :get-container="false" :visible="drawerVisible"
              @close="hideDrawerMenu"
              placement="left" :body-style="{padding:0,width:'256px'}">
      <a-layout-sider class="menu-sider" width="256">
        <router-link to="/index" replace>
          <div class="logo">
            <img src="@/assets/img/logo.svg" alt=""/>
            <span>V dashboard</span>
          </div>
        </router-link>
        <!--  菜单   -->
        <a-menu theme="dark" mode="inline"
                :inline-collapsed="collapsed"
                v-model:selectedKeys="selectedKeys">
          <a-menu-item key="1">
            <UserOutlined/>
            <span class="nav-text">nav 1</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
    </a-drawer>
    <a-layout-sider class="menu-sider" width="256"
                    breakpoint="lg"
                    :trigger="null"
                    v-model:collapsed="collapsed"
                    :collapsible="true"
                    @breakpoint="changeCollapsed"
                    collapsed-width="80" v-else>
      <router-link to="/index" replace>
        <div class="logo">
          <img src="@/assets/img/logo.svg" alt=""/>
          <span v-show="!collapsed">V dashboard</span>
        </div>
      </router-link>
      <!--  菜单   -->
      <a-menu theme="dark" mode="inline"
              :inline-collapsed="collapsed"
              v-model:selectedKeys="selectedKeys">
        <a-menu-item key="1">
          <UserOutlined/>
          <span class="nav-text">nav 1</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <!-- 右侧 -->
    <a-layout class="right">
      <!-- 头部 -->
      <a-layout-header class="header">
        <MenuUnfoldOutlined
            v-if="collapsed"
            class="trigger"
            @click="changeCollapsed(!collapsed)"
        />
        <MenuFoldOutlined v-else class="trigger" @click="changeCollapsed(!collapsed)"/>
      </a-layout-header>
      <!-- 内容区 -->
      <a-layout-content class="content">
        <router-view/>
      </a-layout-content>
      <!-- 脚底 -->
      <a-layout-footer>
        <CopyRight/>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, watchEffect} from 'vue'
import {useStore} from 'vuex'
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons-vue'
import router from '@/router'
import {LOGOUT, UPDATE_TOKEN} from '@/store/actionTypes'
import storage from '@/utils/storage'
import {Token} from '@/interface'
import {getToken} from '@/api/user'
import CopyRight from "@/components/copyright/index.vue"

export default defineComponent({
  name: "Base",
  components: {CopyRight, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined},
  setup() {

    const store = useStore()

    // 校验token
    const checkToken = async () => {
      const timer = setTimeout(checkToken, 5 * 60 * 1000)

      // user access_token refresh_token都存在的  校验有效时间  否则logout
      const user: Token = storage.get('user')
      const access_token: string = storage.get('access_token')
      const refresh_token: string = storage.get('refresh_token')
      const access_token_expire: number = storage.getExpiration('access_token') || -1
      const refresh_token_expire: number = storage.getExpiration('refresh_token') || -1

      if (!user || !refresh_token || refresh_token_expire - new Date().getTime() <= 320) { // refresh_token有效时间不足一次检查周期5分钟
        clearTimeout(timer)
        await store.dispatch(LOGOUT).then()
        router.replace('/login').then()
        return
      }

      // access_token如果到期了 刷新; 未到期, 直接用
      if (access_token && access_token_expire - new Date().getTime() >= 320) { // 剩余时间大于一次检查周期320s>5分钟
        return
      }

      // 获取新的token
      getToken({type: 2, refresh_token}).then(async res => {
        await store.dispatch(UPDATE_TOKEN, res.data).then()
      })

    }

    checkToken()

    const data = reactive({
      selectedKeys: ['1'],
      collapsed: false,
      offsetWidth: document.body.offsetWidth,
      showDrawerMenu: false, // 小屏幕抽屉式导航
      drawerVisible: true
    })

    // 菜单导航收缩/展开
    const changeCollapsed = (broken?: boolean) => {
      if (broken !== undefined && data.offsetWidth > 576) {
        data.collapsed = broken
      } else {
        data.drawerVisible = !data.drawerVisible
      }
    }

    // 监听窗口大小变化
    onMounted(() => {
      window.onresize = () => {
        return (() => data.offsetWidth = document.body.offsetWidth)()
      }

      //todo localStorage user对象加载到vuex中
    })

    // 小屏幕隐藏导航栏
    watchEffect(() => {
      data.showDrawerMenu = data.offsetWidth <= 576
    })

    const hideDrawerMenu = () => {
      data.drawerVisible = false
    }

    return {
      ...toRefs(data),
      changeCollapsed,
      hideDrawerMenu
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "index.styl"
</style>