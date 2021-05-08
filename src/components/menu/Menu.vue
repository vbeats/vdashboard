<template>
  <router-link to="/index" replace>
    <div class="logo">
      <img src="@/assets/img/logo.svg" alt=""/>
      <span v-show="!collapsed">V dashboard</span>
    </div>
  </router-link>
  <!--菜单-->
  <a-menu theme="dark" mode="inline"
          :inline-collapsed="collapsed" v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys" @click="changeRouter">
    <a-menu-item v-for="item in menuItems" :key="item.key">
      <Component :is="item.icon"/>
      <span class="nav-text">{{ item.title }}</span>
    </a-menu-item>

    <a-sub-menu v-for="item in subMenuItems" :key="item.key">
      <template #title>
        <span><Component :is="item.icon"/><span>{{ item.title }}</span></span>
      </template>
      <template v-for="subItem in item.children" :key="subItem.key">
        <a-menu-item :key="subItem.key">{{ subItem.title }}</a-menu-item>
      </template>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import {defineComponent, inject, reactive, toRefs, watchEffect, UnwrapRef} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {HomeOutlined, SettingOutlined} from '@ant-design/icons-vue'
import {Menu} from "@/interface/user";

interface Data {
  selectedKeys: Array<string>,
  openKeys: Array<string>,
  menuItems: Array<Menu>,
  subMenuItems: Array<Menu>,
}

export default defineComponent({
  name: "Menu",
  components: {HomeOutlined, SettingOutlined},
  setup() {

    const router = useRouter()
    const route = useRoute()

    const data: UnwrapRef<Data> = reactive({
      selectedKeys: [],
      openKeys: [],
      menuItems: [],
      subMenuItems: []
    })

    const collapsed = inject('collapsed')
    const menus: Array<Menu> | any = inject('menus')

    menus.value.forEach((i: Menu) => {
      if (i.children && i.children.length > 0) {
        data.subMenuItems.push(i)
      } else {
        data.menuItems.push(i)
      }
      if (i.default_select) {
        data.selectedKeys = [i.key]
      }
      if (i.default_open) {
        data.openKeys = [i.key]
      }
    })

    // 路由切换
    const changeRouter = (item: any) => {
      router.replace({name: item.key})
    }

    watchEffect(() => {
      data.selectedKeys = [route.path.substr(1)]
    })

    return {
      ...toRefs(data),
      collapsed, changeRouter
    }
  }
})
</script>

<style scoped lang="stylus">
.logo
  display flex
  flex-direction row
  height 66px
  margin-left 24px
  align-items center

  img
    height 32px

  span
    color #fff
    font-size 20px
    font-family $font-family
    font-weight bold
    margin-left 10px
</style>