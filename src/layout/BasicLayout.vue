<template>
  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'" class="h-screen overflow-y-auto">
      <Logo/>
      <Menu/>
    </el-aside>
    <el-container class="h-screen">
      <el-header class="p-0 h-[78px]">
        <Header/>
      </el-header>
      <el-main class="p-4">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="tabs">
            <suspense timeout="0">
              <template #default>
                <component :is="Component" :key="route.path"/>
              </template>
              <template #fallback>
                <div v-loading="true" class="w-full h-full"></div>
              </template>
            </suspense>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Logo from '../components/logo/index.vue'
import Menu from '../components/menu/index.vue'
import Header from '../components/header/index.vue'

import {computed, ref, watch, watchEffect} from "vue"
import {useMenuStore} from "../store/menu"
import {breakpointsTailwind, useWindowSize} from "@vueuse/core"
import _ from "lodash"
import {checkToken} from "../util/auth"

// 检查token
checkToken()

const menuStore = useMenuStore()
const isCollapse = ref<boolean>(menuStore.isCollapse)
const {width} = useWindowSize()

watch(width, (v) => {
  if (v < breakpointsTailwind.md) {
    menuStore.isCollapse = true
  } else {
    menuStore.isCollapse = false
  }
})

watchEffect(() => {
  isCollapse.value = menuStore.isCollapse
})

// 需要缓存的组件
const tabs = computed(() => _.map(menuStore.tabs, (item: any) => item.key || ''))

</script>

<style lang="stylus" scoped>

</style>