<template>
  <div class="logo h-[64px] flex flex-row justify-center items-center text-teal-50 cursor-pointer">
    <img src="/vite.svg" alt="" class="w-[32px] h-[32px]">
    <transition>
      <span class="ml-2 font-bold text-2xl" v-if="!isCollapse">V Cloud</span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {useMenuStore} from "../../store/menu";
import {ref, watchEffect} from "vue";

const menuStore = useMenuStore()
const isCollapse = ref<boolean>(menuStore.is_collapse)

watchEffect(() => {
  isCollapse.value = menuStore.is_collapse
})
</script>

<style scoped lang="stylus">
.logo
  background-color #001529
  border-right solid 1px var(--el-menu-border-color)

</style>