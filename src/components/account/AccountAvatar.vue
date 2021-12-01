<template>
  <a-dropdown placement="bottomRight">
    <span class="block text-center h-16 flex items-center">
      <img :src="data.avatar" alt="" class="w-6 h-6" />
      <span class="ml-2">{{ data.account }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="updateUserInfo">
          <span class="text-xs"><EditOutlined /></span>
          <span class="text-sm ml-1">修改密码</span>
        </a-menu-item>
        <a-menu-item key="logout">
          <span class="text-xs"><LogoutOutlined /></span>
          <span class="text-sm ml-1">退出登录</span>
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
import {EditOutlined, LogoutOutlined} from '@ant-design/icons-vue'

const store = useStore()
const router = useRouter()
const user = store.getters.getUserInfo

const data = reactive({
  avatar: user.avatar || Avatar,
  account: user.nick_name || user.account,
  userInfoModal: false,
})

const handleMenuClick = (item: any) => {
  switch (item.key) {
    case 'updateUserInfo':
      data.userInfoModal = true
      break
    case 'logout':
      store.dispatch('logout').then()
      router.replace({name: 'login'}).then()
      break
  }
}

const handleCancel = () => {
  data.userInfoModal = false
}
</script>

<style scoped></style>
