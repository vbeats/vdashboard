<template>
  <a-layout-sider
    v-model:collapsed="menuStatus.collapsed"
    :collapsible="true"
    :trigger="null"
    breakpoint="lg"
    class="overflow-hidden relative left-0"
    collapsed-width="80"
    width="256"
    @breakpoint="changeCollapsed"
  >
    <Menu />
  </a-layout-sider>
</template>

<script lang="ts" setup>
import {defineEmits, inject} from 'vue'
import Menu from '@/components/menu/Menu.vue'

const emit = defineEmits(['changeCollapsed'])

const menuStatus = inject('menuStatus')

const changeCollapsed = (broken: boolean) => {
  emit('changeCollapsed', broken)
}
</script>

<style lang="stylus" scoped></style>
