<template>
  <a-dropdown placement="bottomRight">
    <span class="block text-center h-16 flex items-center">
      <img :src="avatar" alt="" class="w-6 h-6">
      <span class="ml-2">{{ username }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="updateUserInfo">
          <span class="text-xs"><EditOutlined/></span>
          <span class="text-sm ml-1">修改密码</span>
        </a-menu-item>
        <a-menu-item key="logout">
          <span class="text-xs"><LogoutOutlined/></span>
          <span class="text-sm ml-1">退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <UserInfoModal :visible="userInfoModal" @cancel="handleCancel"/>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { EditOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import Avatar from '@/assets/img/avatar.png'
import UserInfoModal from '@/components/header/UserInfoModal.vue'

export default defineComponent({
  name: 'AccountAvatar',
  components: {
    LogoutOutlined,
    EditOutlined,
    UserInfoModal
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const user = store.state.user.user

    const data = reactive({
      avatar: user.avatar || Avatar,
      username: user.username,
      userInfoModal: false
    })

    const handleMenuClick = (item) => {
      switch (item.key) {
        case 'updateUserInfo':
          data.userInfoModal = true
          break
        case 'logout':
          store.dispatch('logout').then()
          router.replace({ name: 'login' }).then()
          break
      }
    }

    const handleCancel = () => {
      data.userInfoModal = false
    }

    return {
      ...toRefs(data),
      handleMenuClick,
      handleCancel
    }
  }
})
</script>

<style scoped>

</style>
