<template>
  <a-drawer :closable="false"
            :get-container="false" :visible="drawerVisible"
            @close="hideDrawerMenu"
            placement="left" :body-style="{padding:0,width:$menuWidth}">
    <a-layout-sider class="overflow-hidden relative left-0 h-screen" width="256">
      <Menu/>
    </a-layout-sider>
  </a-drawer>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Menu from "@/components/menu/Menu.vue"

export default defineComponent({
  name: "DrawerMenu",
  components: {Menu},
  emits: ['hideDrawerMenu'],
  props: {
    drawerVisible: {
      type: Boolean,
      required: true
    }
  },
  setup(props, {emit}) {

    const hideDrawerMenu = () => {
      emit('hideDrawerMenu')
    }

    return {
      hideDrawerMenu
    }
  }
})
</script>

<style scoped>

</style>