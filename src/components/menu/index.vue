<template>
  <el-menu
      active-text-color="#ffd04b"
      background-color="#001529"
      class="menu"
      :default-active="defaultActive"
      :default-openeds="defaultOpens"
      text-color="#fff"
      :collapse="isCollapse"
      @open="handleOpen"
  >
    <el-menu-item index="index" @click="clickMenu({key:'index'},'/index')">
      <el-icon>
        <HomeFilled/>
      </el-icon>
      <span>首 页</span>
    </el-menu-item>
    <el-sub-menu v-for="subMenu in menus" :index="subMenu.key" :key="subMenu.key">
      <template #title>
        <el-icon>
          <Component :is="subMenu.icon"/>
        </el-icon>
        <span>{{ subMenu.title }}</span>
      </template>
      <el-menu-item v-for="item in subMenu.children" :index="item.key" :key="item.key" @click="clickMenu(item,subMenu.path+item.path)">
        <el-icon>
          <Component :is="item.icon"/>
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {useMenuStore} from "../../store/menu"
import {useRouter} from "vue-router"
import {computed, ref, watchEffect} from "vue"

const menuStore = useMenuStore()
const router = useRouter()

const menus = menuStore.menus
const isCollapse = ref<boolean>(menuStore.is_collapse)
const defaultOpens = menuStore.default_opens
const defaultActive = computed(() => menuStore.default_active)

const clickMenu = (item: any, path: string) => {
  if (item.key !== 'index') {
    menuStore.addTab({...item, path})
  } else {
    menuStore.updateCurrentTab('0', 'index')
  }
  router.replace({path})
}

const handleOpen = (key: string, keyPath: string[]) => {
  menuStore.updateDefaultOpens(keyPath)
}

watchEffect(() => {
  isCollapse.value = menuStore.is_collapse
})

</script>

<style scoped lang="stylus">
.menu
  height calc(100vh - 64px)
</style>