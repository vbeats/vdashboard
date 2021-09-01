<template>
  <router-link replace to="/index">
    <div class="flex flex-row h-16 ml-6 items-center">
      <img alt="" class="h-8" src="@/assets/img/logo.svg"/>
      <span v-show="!collapsed" class="text-white text-xl font-bold ml-2.5">V dashboard</span>
    </div>
  </router-link>
  <!--菜单-->
  <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys"
          :inline-collapsed="collapsed" mode="inline"
          theme="dark" @click="changeRouter">
    <a-menu-item v-for="item in menuItems" :key="item.key">
      <Component :is="item.icon" keep-alive/>
      <span class="nav-text">{{ item.title }}</span>
    </a-menu-item>

    <a-sub-menu v-for="item in subMenuItems" :key="item.key">
      <template #title>
        <span><Component :is="item.icon" keep-alive/><span>{{ item.title }}</span></span>
      </template>
      <a-menu-item v-for="subItem in item.children" :key="subItem.key">{{ subItem.title }}</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs, UnwrapRef, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons-vue'

interface Data {
  selectedKeys: Array<string>,
  openKeys: Array<string>,
  menuItems: Array<any>,
  subMenuItems: Array<any>,
}

export default defineComponent({
  name: 'Menu',
  components: {
    HomeOutlined,
    SettingOutlined
  },
  setup () {
    const router = useRouter()
    const route = useRoute()

    const data: UnwrapRef<Data> = reactive({
      selectedKeys: [],
      openKeys: [],
      menuItems: [],
      subMenuItems: []
    })

    const collapsed = inject('collapsed')
    const menus: Array<any> | any = inject('menus')

    menus.value.forEach((i: any) => {
      if (i.children && i.children.length > 0) {
        data.subMenuItems.push(i)
      } else {
        data.menuItems.push(i)
      }
      if (i.default_select) {
        data.selectedKeys = [i.key]
      }
      if (i.default_open) {
        data.openKeys.push(i.key)
      }
    })

    // 路由切换
    const changeRouter = (item: any) => {
      router.replace({ name: item.key })
    }

    watchEffect(() => {
      data.selectedKeys = [route.path.substr(1)]
    })

    return {
      ...toRefs(data),
      collapsed,
      changeRouter
    }
  }
})
</script>

<style lang="stylus" scoped>

</style>
