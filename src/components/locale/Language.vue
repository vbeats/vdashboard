<template>
  <a-dropdown placement="bottomRight">
    <span class="w-14 h-16 block text-center cursor-pointer flex items-center justify-center hover:bg-gray-200">
      <GlobalOutlined class="w-4 h-4 text-black text-opacity-60" />
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="zh-CN" :class="{'active-item': data.key === 'zh-CN'}">
          <span class="text-xs">CN</span>
          <span class="text-sm ml-2">简体中文</span>
        </a-menu-item>
        <a-menu-item key="en-US" :class="{'active-item': data.key === 'en-US'}">
          <span class="text-xs">US</span>
          <span class="text-sm ml-2">English</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import {useStore} from 'vuex'
import {GlobalOutlined} from '@ant-design/icons-vue'
import {useI18n} from 'vue-i18n'

const store = useStore()
const i18n = useI18n()

const data = reactive({
  key: store.state.app.lang,
})

const handleMenuClick = (item: any) => {
  data.key = item.key
  store.dispatch('load_language', item.key)
  i18n.locale.value = item.key
}
</script>

<style lang="stylus" scoped>
::v-deep(.active-item)
  background-color #fff1f0
  color #f5222d
</style>
