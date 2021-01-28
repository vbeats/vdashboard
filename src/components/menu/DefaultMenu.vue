<template>
  <a-layout-sider class="menu-sider" width="256"
                  breakpoint="lg"
                  :trigger="null"
                  v-model:collapsed="collapsed"
                  :collapsible="true"
                  @breakpoint="changeCollapsed"
                  collapsed-width="80">
    <Menu/>
  </a-layout-sider>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue'
import Menu from "@/components/menu/Menu.vue";

export default defineComponent({
  name: "DefaultMenu",
  components: {Menu},
  emits: ['changeCollapsed'],
  setup(props, {emit}) {
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

<style scoped lang="stylus">
.menu-sider
  overflow hidden
  position relative
  left 0
</style>