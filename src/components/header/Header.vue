<template>
  <MenuUnfoldOutlined v-if="menuStatus.collapsed" class="text-lg px-6 cursor-pointer transition-colors" style="line-height: 4rem" @click="changeCollapsed(!menuStatus.collapsed)" />
  <MenuFoldOutlined v-else class="text-lg px-6 cursor-pointer transition-colors" style="line-height: 4rem" @click="changeCollapsed(!menuStatus.collapsed)" />

  <a-breadcrumb style="line-height: unset">
    <a-breadcrumb-item v-for="(item, index) in breads" :key="index">{{ item }}</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="ml-auto">
    <AccountAvatar />
  </div>

  <div class="ml-2 mr-2">
    <Language />
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, inject, ref, watchEffect} from 'vue'
import Language from '@/components/locale/Language.vue'
import AccountAvatar from '@/components/account/AccountAvatar.vue'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons-vue'
import {useRoute} from 'vue-router'

const emit = defineEmits(['changeCollapsed'])

const changeCollapsed = (broken: boolean) => {
  emit('changeCollapsed', broken)
}

const menuStatus = inject('menuStatus')

const route = useRoute()
const breads = ref<Array<string>>([])

watchEffect(() => {
  route.meta.breads ? (breads.value = (route.meta.breads as string).split('_').filter((v) => v && v !== '')) : null
})
</script>

<style lang="stylus">
.active-item
  background-color #fff1f0 !important
  color #f5222d !important
</style>
