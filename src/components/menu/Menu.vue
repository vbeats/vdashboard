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
    <a-menu-item key="index">
      <UserOutlined/>
      <span class="nav-text">首 页</span>
    </a-menu-item>

    <a-sub-menu key="sub1">
      <template #title>
        <span><MailOutlined/><span>二级菜单</span></span>
      </template>
      <a-menu-item key="test">test页面</a-menu-item>
      <a-menu-item key="6">Option 6</a-menu-item>
      <a-menu-item key="7">Option 7</a-menu-item>
      <a-menu-item key="8">Option 8</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import {defineComponent, inject, reactive, toRefs, watchEffect} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {MailOutlined, UserOutlined} from '@ant-design/icons-vue'

export default defineComponent({
  name: "Menu",
  components: {UserOutlined, MailOutlined},
  setup() {

    const router = useRouter()
    const route = useRoute()

    const data = reactive({
      selectedKeys: ['index'],
      openKeys: ['sub1']
    })

    const collapsed = inject('collapsed')

    // 路由切换
    const changeRouter = (item: any) => {
      router.replace('/' + item.key)
    }

    watchEffect(() => {
      const path = route.path
      data.selectedKeys = new Array<string>(path.substr(1))
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