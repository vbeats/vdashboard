<template>
  <div class="w-full flex flex-col items-center mt-16">
    <img :src="user.avatar ? user.avatar : Avatar" class="w-32" />
    <span class="mt-4 text-lg font-sans">{{ user.phone }}</span>
    <span class="mt-4 text-lg font-sans">{{ user.account }} {{ user.nick_name }} {{ user.gender === 0 ? '未知' : user.gender === 1 ? '男' : '女' }}</span>
    <a-button type="primary" class="mt-8" @click="updateModal = true">修改用户信息</a-button>
    <UserInfoModal :visible="updateModal" :item="user" @handleOk="handleOk" @handleCancel="updateModal = false" />
  </div>
</template>

<script lang="ts" setup>
import {useStore} from 'vuex'
import Avatar from '@/assets/img/avatar.png'
import {ref} from 'vue'
import UserInfoModal from '@/components/modal/profile/UserInfoModal.vue'
import encrypt from '@/util/crypto'
import {updateUserProfile} from '@/api/auth'
import {message} from 'ant-design-vue'
import {loadUserProfile} from '@/util/authUtil'

const store = useStore()
const user = store.getters.getUserInfo
const updateModal = ref<boolean>(false)

const handleOk = async (params: any) => {
  if (params.password && params.password !== '') {
    params.password = encrypt(params.password)
  }
  const res = await updateUserProfile(params)
  if (res.code === 200) {
    await loadUserProfile()
    message.success('更新成功')
    updateModal.value = false
  }
}
</script>

<style scoped lang="stylus"></style>
