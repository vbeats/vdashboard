<template>
  <a-layout-sider v-model:collapsed="collapsed" :collapsible="true"
                  :trigger="null"
                  breakpoint="lg"
                  class="overflow-hidden relative left-0"
                  collapsed-width="80"
                  width="256"
                  @breakpoint="changeCollapsed">
    <Menu/>
  </a-layout-sider>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import Menu from '@/components/menu/Menu.vue'

export default defineComponent({
  name: 'DefaultMenu',
  components: { Menu },
  emits: ['changeCollapsed'],
  setup (props, { emit }) {
    const collapsed = inject('collapsed')

    const changeCollapsed = (broken: boolean) => {
      emit('changeCollapsed', broken)
    }

    return {
      collapsed,
      changeCollapsed
    }
  }
})
</script>

<style lang="stylus" scoped>

</style>
