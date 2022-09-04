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
      <el-main class="p-8">
        <router-view/>
      </el-main>
      <el-footer>
        <copy-right/>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import CopyRight from '../components/copyright/index.vue'
import Logo from '../components/logo/index.vue'
import Menu from '../components/menu/index.vue'
import Header from '../components/header/index.vue'
import {checkToken} from "../util/auth"

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

checkToken()

</script>

<style scoped lang="stylus">

</style>