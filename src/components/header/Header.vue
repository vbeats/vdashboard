<template>
  <MenuUnfoldOutlined v-if="menuStatus.collapsed" class="text-lg px-6 cursor-pointer transition-colors" style="line-height: 4rem" @click="changeCollapsed(!menuStatus.collapsed)" />
  <MenuFoldOutlined v-else class="text-lg px-6 cursor-pointer transition-colors" style="line-height: 4rem" @click="changeCollapsed(!menuStatus.collapsed)" />

  <div class="ml-auto">
    <AccountAvatar />
  </div>

  <div class="ml-2 mr-2">
    <Language />
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, inject} from 'vue'
import Language from '@/components/locale/Language.vue'
import AccountAvatar from '@/components/account/AccountAvatar.vue'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons-vue'

const emit = defineEmits(['changeCollapsed'])

const changeCollapsed = (broken: boolean) => {
  emit('changeCollapsed', broken)
}

const menuStatus = inject('menuStatus')
</script>

<style scoped></style>
