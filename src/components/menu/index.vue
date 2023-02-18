<template>
  <el-menu
      :collapse="isCollapse"
      :default-active="defaultActive"
      :default-openeds="defaultOpens"
      active-text-color="#ffd04b"
      background-color="#001529"
      class="menu"
      text-color="#fff"
      @open="handleOpen"
  >
    <el-menu-item index="index" @click="clickMenu({key:'index'},'/index')">
      <el-icon>
        <HomeFilled/>
      </el-icon>
      <span>首 页</span>
    </el-menu-item>
    <el-sub-menu v-for="subMenu in menus" :key="subMenu.key" :index="subMenu.key">
      <template #title>
        <el-icon>
          <Component :is="subMenu.icon"/>
        </el-icon>
        <span>{{ subMenu.title }}</span>
      </template>
      <el-menu-item v-for="item in subMenu.children" :key="item.key" :index="item.key" @click="clickMenu(item,subMenu.path+item.path)">
        <el-icon>
          <Component :is="item.icon"/>
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import {useMenuStore} from "../../store/menu"
import {useRouter} from "vue-router"
import {computed, ref, watchEffect} from "vue"

const menuStore = useMenuStore()
const router = useRouter()

const menus = menuStore.menus
const isCollapse = ref<boolean>(menuStore.isCollapse)
const defaultOpens = menuStore.defaultOpens
const defaultActive = computed(() => menuStore.defaultActive)

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
  isCollapse.value = menuStore.isCollapse
})

</script>

<style lang="stylus" scoped>
.menu
  height calc(100vh - 64px)
</style>