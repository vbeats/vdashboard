<template>
  <router-link replace to="/">
    <div class="flex flex-row h-16 ml-6 items-center">
      <img alt="" class="h-8" src="@/assets/img/logo.svg" />
      <span v-show="!menuStatus.collapsed || (menuStatus.showDrawerMenu && menuStatus.drawerVisible)" class="text-white text-xl font-bold ml-2.5">V dashboard</span>
    </div>
  </router-link>
  <!--菜单-->
  <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" theme="dark" @click="changeRouter">
    <a-menu-item v-for="item in menuItems" :key="item.key">
      <template #icon>
        <Component :is="item.icon" keep-alive />
      </template>
      <span class="nav-text">{{ item.title }}</span>
    </a-menu-item>
    <a-sub-menu key="test">
      <template #icon>
        <MonitorOutlined />
      </template>
      <template #title>测试模块</template>
      <a-menu-item key="map">百度地图</a-menu-item>
      <a-menu-item key="amap">高德地图</a-menu-item>
    </a-sub-menu>
    <a-sub-menu v-for="item in subMenuItems" :key="item.key">
      <template #icon>
        <Component :is="item.icon" keep-alive />
      </template>
      <template #title>
        <span>{{ item.title }}</span>
      </template>
      <a-menu-item v-for="subItem in item.children" :key="subItem.key">{{ subItem.title }}</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import {defineComponent, inject, reactive, toRefs, UnwrapRef, watchEffect} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {HomeOutlined, MonitorOutlined, SettingOutlined} from '@ant-design/icons-vue'
import _ from 'lodash'

interface Item {
  title: string
  key: string
  icon?: string
  children?: string
}

interface Data {
  selectedKeys: Array<string>
  openKeys: Array<string>
  defaultOpenKeys: Array<string>
  menuItems: Array<Item>
  subMenuItems: Array<Item>
}

export default defineComponent({
  name: 'Menu',
  components: {
    HomeOutlined,
    SettingOutlined,
    MonitorOutlined,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const data: UnwrapRef<Data> = reactive({
      selectedKeys: [],
      openKeys: [],
      defaultOpenKeys: [],
      menuItems: [],
      subMenuItems: [],
    })

    const menuStatus = inject('menuStatus')
    const menus: Array<any> | any = inject('menus')

    menus.value.forEach((i: any) => {
      if (i.children && i.children.length > 0 && i.show) {
        data.subMenuItems.push(i)
      } else if (i.show) {
        data.menuItems.push(i)
      }
      if (i.default_select) {
        data.selectedKeys = [i.key]
      }
      if (i.default_open) {
        data.openKeys.push(i.key)
        data.defaultOpenKeys.push(i.key)
      }
    })

    // 路由切换
    const changeRouter = (item: any) => {
      router.replace({name: item.key})
    }

    watchEffect(() => {
      data.selectedKeys = [route.path.substring(route.path.lastIndexOf('/') + 1)]
      data.openKeys = _.concat(data.defaultOpenKeys, route.path.substring(route.path.indexOf('/') + 1, route.path.lastIndexOf('/')))
    })

    return {
      ...toRefs(data),
      menuStatus,
      menus,
      changeRouter,
    }
  },
})
</script>

<style lang="stylus" scoped></style>
