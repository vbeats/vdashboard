<template>
  <MenuUnfoldOutlined
    v-if="collapsed"
    class="text-lg leading-16 px-6 cursor-pointer transition-colors"
    @click="changeCollapsed(!collapsed)"
  />
  <MenuFoldOutlined v-else class="text-lg leading-16 px-6 cursor-pointer transition-colors"
                    @click="changeCollapsed(!collapsed)"/>

  <div class="ml-auto">
    <AccountAvatar/>
  </div>

  <div class="ml-2 mr-2">
    <Language/>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import Language from '@/components/language/Language.vue'
import AccountAvatar from '@/components/account/AccountAvatar.vue'

export default defineComponent({
  name: 'Header',
  components: {
    AccountAvatar,
    Language,
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },
  emits: ['changeCollapsed'],
  setup (props, { emit }) {
    const changeCollapsed = (broken: boolean) => {
      emit('changeCollapsed', broken)
    }

    const collapsed = inject('collapsed')

    return {
      changeCollapsed,
      collapsed
    }
  }
})
</script>

<style scoped>
</style>
