<template>
  <a-layout class="min-h-screen">
    <DrawerMenu v-if="data.showDrawerMenu" :drawerVisible="data.drawerVisible" @hideDrawerMenu="hideDrawerMenu" />
    <DefaultMenu v-else @changeCollapsed="changeCollapsed" />
    <!--右侧-->
    <a-layout>
      <!--头部-->
      <a-layout-header class="flex bg-white p-0 h-16">
        <Header @changeCollapsed="changeCollapsed" />
      </a-layout-header>
      <!--内容区-->
      <a-layout-content class="mt-6 mb-0 mx-4 p-6 bg-white">
        <router-view />
      </a-layout-content>
      <!--脚底-->
      <a-layout-footer>
        <CopyRight />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import {provide, reactive, ref, watchEffect} from 'vue'
import {useStore} from 'vuex'
import CopyRight from '@/components/copyright/CopyRight.vue'
import Header from '@/components/header/Header.vue'
import DrawerMenu from '@/components/menu/DrawerMenu.vue'
import DefaultMenu from '@/components/menu/DefaultMenu.vue'
import {checkToken} from '@/util/authUtil'
import {useWindowSize} from '@vueuse/core'

// 校验token
checkToken()

const {width} = useWindowSize()

const data = reactive({
  offsetWidth: width,
  showDrawerMenu: false,
  drawerVisible: true,
  collapsed: false,
})

// 加载菜单数据
const store = useStore()
const menus: Array<any> = store.getters.getUserInfo.menus || []

provide('menuStatus', data)
provide('menus', ref(menus))

// 菜单导航收缩/展开
const changeCollapsed = (broken?: boolean) => {
  if (broken !== undefined && data.offsetWidth > 576) {
    data.collapsed = broken
  } else {
    data.drawerVisible = !data.drawerVisible
  }
}

// 小屏幕隐藏导航栏
watchEffect(() => {
  data.showDrawerMenu = data.offsetWidth <= 576
})

const hideDrawerMenu = () => {
  data.drawerVisible = false
}
</script>

<style scoped lang="stylus"></style>
