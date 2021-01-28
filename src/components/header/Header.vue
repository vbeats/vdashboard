<template>
  <MenuUnfoldOutlined
      v-if="collapsed"
      class="trigger"
      @click="changeCollapsed(!collapsed)"
  />
  <MenuFoldOutlined v-else class="trigger" @click="changeCollapsed(!collapsed)"/>

  <div class="avatar">
    <AccountAvatar/>
  </div>

  <div class="language">
    <Language/>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons-vue'
import Language from "@/components/language/Language.vue";
import AccountAvatar from "@/components/account/AccountAvatar.vue";

export default defineComponent({
  name: "Header",
  components: {AccountAvatar, Language, MenuUnfoldOutlined, MenuFoldOutlined},
  emits: ['changeCollapsed'],
  setup(props, {emit}) {
    const changeCollapsed = (broken: boolean) => {
      emit('changeCollapsed', broken)
    }

    const collapsed = inject('collapsed')

    return {
      changeCollapsed, collapsed
    }
  }
})
</script>

<style scoped lang="stylus">

.avatar
  margin-left auto

.language
  margin-left 10px
  margin-right 8px

.trigger
  font-size 18px
  line-height 64px
  padding 0 24px
  cursor pointer
  transition color 0.3s
</style>