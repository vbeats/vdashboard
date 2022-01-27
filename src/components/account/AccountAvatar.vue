<template>
  <a-dropdown placement="bottomRight">
    <span class="block px-4 text-center h-16 flex items-center cursor-pointer hover:bg-gray-200">
      <img :src="data.avatar" alt="" class="w-6 h-6" />
      <span class="ml-2">{{ data.account }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="updateUserInfo" :class="{'active-item': data.key === 'updateUserInfo'}">
          <span class="text-xs"><UserOutlined /></span>
          <span class="text-sm ml-2">个人信息</span>
        </a-menu-item>
        <a-menu-item key="logout" :class="{'active-item': data.key === 'logout'}">
          <span class="text-xs"><LogoutOutlined /></span>
          <span class="text-sm ml-2">退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import Avatar from '@/assets/img/avatar.png'
import {LogoutOutlined, UserOutlined} from '@ant-design/icons-vue'

const store = useStore()
const router = useRouter()
const user = store.getters.getUserInfo

const data = reactive({
  avatar: user.avatar || Avatar,
  account: user.nick_name || user.account,
  key: 'updateUserInfo',
})

const handleMenuClick = (item: any) => {
  data.key = item.key
  switch (item.key) {
    case 'updateUserInfo':
      router.push({name: 'profile'})
      break
    case 'logout':
      store.dispatch('logout')
      router.replace({name: 'login'})
      break
  }
}
</script>

<style lang="stylus" scoped></style>
