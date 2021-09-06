<template>
  <a-drawer :body-style="{padding:0,width:'256px'}"
            :closable="false" :get-container="false"
            :visible="drawerVisible"
            placement="left" @close="hideDrawerMenu">
    <a-layout-sider :trigger="false" class="overflow-hidden relative left-0 h-screen"
                    width="256">
      <Menu/>
    </a-layout-sider>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from '@/components/menu/Menu.vue'

export default defineComponent({
  name: 'DrawerMenu',
  components: { Menu },
  emits: ['hideDrawerMenu'],
  props: {
    drawerVisible: {
      type: Boolean,
      required: true
    }
  },
  setup (props, { emit }) {
    const hideDrawerMenu = () => {
      emit('hideDrawerMenu')
    }

    return {
      hideDrawerMenu
    }
  }
})
</script>

<style lang="stylus" scoped>

</style>
