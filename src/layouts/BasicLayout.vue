<template>
  <a-layout class="min-h-screen">
    <DrawerMenu v-if="showDrawerMenu"
                :drawerVisible="drawerVisible"
                @hideDrawerMenu="hideDrawerMenu"
    />
    <DefaultMenu v-else @changeCollapsed="changeCollapsed"/>
    <!--右侧-->
    <a-layout>
      <!--头部-->
      <a-layout-header class="flex bg-white p-0 h-16">
        <Header @changeCollapsed="changeCollapsed"/>
      </a-layout-header>
      <!--内容区-->
      <a-layout-content class="mt-6 mb-0 mx-4 p-6 bg-white">
        <router-view/>
      </a-layout-content>
      <!--脚底-->
      <a-layout-footer>
        <CopyRight/>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, onMounted, provide, reactive, ref, toRefs, watchEffect} from 'vue'
import {useStore} from 'vuex'
import CopyRight from "@/components/copyright/CopyRight.vue"
import Header from "@/components/header/Header.vue"
import DrawerMenu from "@/components/menu/DrawerMenu.vue"
import DefaultMenu from "@/components/menu/DefaultMenu.vue"
import checkToken from "@/utils/checkToken"
import {Menu} from "@/interface/user";

export default defineComponent({
  name: "Base",
  components: {DefaultMenu, DrawerMenu, Header, CopyRight},
  setup() {

    //校验token
    checkToken()

    const data = reactive({
      offsetWidth: document.body.offsetWidth,
      showDrawerMenu: false,
      drawerVisible: true,
      collapsed: false,
    })

    // 加载菜单数据
    const store = useStore()
    const menus: Array<Menu> = store.getters.getUserInfo.user.menus || []

    const collapsed = ref(data.collapsed)

    provide('collapsed', collapsed)
    provide('menus', ref(menus))

    // 菜单导航收缩/展开
    const changeCollapsed = (broken?: boolean) => {
      if (broken !== undefined && data.offsetWidth > 576) {
        data.collapsed = broken
        collapsed.value = broken
      } else {
        data.drawerVisible = !data.drawerVisible
      }
    }

    // 监听窗口大小变化
    onMounted(() => {
      window.onresize = () => {
        return (() => data.offsetWidth = document.body.offsetWidth)()
      }
    })

    // 小屏幕隐藏导航栏
    watchEffect(() => {
      data.showDrawerMenu = data.offsetWidth <= 576
    })

    const hideDrawerMenu = () => {
      data.drawerVisible = false
    }

    return {
      ...toRefs(data),
      changeCollapsed,
      hideDrawerMenu
    }
  }
})
</script>

<style scoped>
</style>