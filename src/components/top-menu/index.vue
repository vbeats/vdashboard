<template>
  <div class="ml-14 flex flex-row items-center">
    <div v-for="item in topMenus" :key="item.key" class="flex flex-row items-center cursor-pointer h-[64px] ml-4">
      <el-icon>
        <Component :is="item.icon"/>
      </el-icon>
      <span class="text-sm ml-2">{{ item.title }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useMenuStore} from "../../store/menu";
import {ref, watchEffect} from "vue";

const menuStore = useMenuStore()
const topMenus = ref<Array<any>>(menuStore.top_menus)

watchEffect(() => {
  topMenus.value = menuStore.top_menus
})
</script>

<style scoped lang="stylus">

</style>