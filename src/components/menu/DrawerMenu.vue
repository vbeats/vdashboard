<template>
  <a-drawer :body-style="{padding: 0, width: '256px'}" :closable="false" :get-container="false" :visible="drawerVisible" placement="left" @close="hideDrawerMenu" :width="256">
    <a-layout-sider :trigger="false" class="overflow-hidden relative left-0 h-screen" width="256">
      <Menu />
    </a-layout-sider>
  </a-drawer>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps} from 'vue'
import Menu from '@/components/menu/Menu.vue'

const emit = defineEmits(['hideDrawerMenu'])

const props = defineProps({
  drawerVisible: {
    type: Boolean,
    required: true,
  },
})

const hideDrawerMenu = () => {
  emit('hideDrawerMenu')
}
</script>

<style lang="stylus" scoped></style>
