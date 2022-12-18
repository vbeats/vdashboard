<template>
  <div class="header px-4 h-[48px] flex flex-row items-center">
    <el-icon class="text-2xl cursor-pointer transition-colors" @click="toggleMenu">
      <Component :is="icon"/>
    </el-icon>
    <!--  消息  -->
    <top-msg/>
    <!--  账号  -->
    <top-account/>
  </div>

  <tabs/>
</template>

<script lang="ts" setup>
import {ref, watchEffect} from "vue"
import TopMsg from '../top-msg/index.vue'
import TopAccount from '../top-account/index.vue'
import Tabs from './tabs.vue'
import {useMenuStore} from "../../store/menu"

const menuStore = useMenuStore()

const icon = ref<string>(menuStore.is_collapse ? 'Expand' : 'Fold')

const toggleMenu = async () => {
  await menuStore.toggleCollapse()
}

watchEffect(() => {
  icon.value = menuStore.is_collapse ? 'Expand' : 'Fold'
})
</script>

<style scoped lang="stylus">
.header
  color rgb(96, 98, 102)
  fill rgb(96, 98, 102)
  border-bottom 1px solid rgb(246, 246, 246)
  box-shadow 0 1px 2px 0 rgba(0, 0, 0, .05)
</style>