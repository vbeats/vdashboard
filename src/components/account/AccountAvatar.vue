<template>
  <a-dropdown placement="bottomRight">
    <span class="account-avatar">
      <img :src="avatar" alt="">
      <span>{{ username }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="logout">
          <span class="short"><LogoutOutlined/></span>
          <span class="text">退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import {defineComponent, reactive, toRefs} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {LogoutOutlined} from '@ant-design/icons-vue'
import Avatar from '@/assets/img/avatar.png'
import {LOGOUT} from '@/store/actionTypes'

export default defineComponent({
  name: "AccountAvatar",
  components: {LogoutOutlined},
  setup() {

    const store = useStore()
    const router = useRouter()
    const user = store.state.user.user

    const data = reactive({
      avatar: user.avatar || Avatar,
      username: user.nickname || user.username
    })

    const handleMenuClick = (item) => {
      switch (item.key) {
        case 'logout':
          store.dispatch(LOGOUT).then()
          router.replace({name: 'login'}).then()
          break
      }
    }

    return {
      ...toRefs(data),
      handleMenuClick
    }
  }
})
</script>

<style scoped lang="stylus">
.account-avatar
  display block
  text-align center
  width 80px
  height 64px

  img
    width 24px
    height 24px

  span
    margin-left 8px

.short
  font-size 12px

.text
  font-size 14px
  margin-left 4px

</style>