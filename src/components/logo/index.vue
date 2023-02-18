<template>
  <div class="logo h-[64px] flex flex-row justify-center items-center text-teal-50 cursor-pointer">
    <img alt="" class="w-[32px] h-[32px]" src="/vite.svg">
    <transition>
      <span v-if="!isCollapse" class="ml-2 font-bold text-2xl">V Cloud</span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {useMenuStore} from "../../store/menu";
import {ref, watchEffect} from "vue";

const menuStore = useMenuStore()
const isCollapse = ref<boolean>(menuStore.isCollapse)

watchEffect(() => {
  isCollapse.value = menuStore.isCollapse
})
</script>

<style lang="stylus" scoped>
.logo
  background-color #001529
  border-right solid 1px var(--el-menu-border-color)

</style>