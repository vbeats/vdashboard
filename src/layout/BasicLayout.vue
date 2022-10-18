<template>
  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'" class="h-screen overflow-y-auto">
      <Logo/>
      <Menu/>
    </el-aside>
    <el-container class="h-screen">
      <el-header>
        <Header/>
      </el-header>
      <el-main class="p-4">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="needKeepAlive">
            <suspense>
              <template #default>
                <component :is="Component"/>
              </template>
              <template #fallback>
                <div v-loading="true"></div>
              </template>
            </suspense>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Logo from '../components/logo/index.vue'
import Menu from '../components/menu/index.vue'
import Header from '../components/header/index.vue'

import {ref, watch, watchEffect} from "vue"
import {useMenuStore} from "../store/menu"
import {breakpointsTailwind, useWindowSize} from "@vueuse/core"

const menuStore = useMenuStore()
const isCollapse = ref<boolean>(menuStore.is_collapse)
const {width} = useWindowSize()

watch(width, (v) => {
  if (v < breakpointsTailwind.md) {
    menuStore.is_collapse = true
  } else {
    menuStore.is_collapse = false
  }
})

watchEffect(() => {
  isCollapse.value = menuStore.is_collapse
})

// 需要缓存的组件
const needKeepAlive = ref([''])

</script>

<style scoped lang="stylus">

</style>