<template>
  <div class="ml-14 flex flex-row items-center">
    <div v-for="item in topMenus" :key="item.key" class="flex flex-row items-center cursor-pointer h-[64px] ml-4" @click="loadMenu(item)">
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
import {menus} from "../../api/menu";

const menuStore = useMenuStore()
const topMenus = ref<Array<any>>(menuStore.top_menus)

watchEffect(() => {
  topMenus.value = menuStore.top_menus
})

const loadMenu = async (item: any) => {
  const res = await menus({top_menu_id: item.id || null})
  await menuStore.updateSideMenu(res.data)
}
</script>

<style scoped lang="stylus">

</style>