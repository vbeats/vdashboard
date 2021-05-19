<template>
  <a-dropdown placement="bottomRight">
    <span class="w-14 h-16 block text-center cursor-pointer flex items-center justify-center">
      <GlobalOutlined class="w-4 h-4 text-black text-opacity-60"/>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="zh-CN" :class="{'active-item':key==='zh-CN'}">
          <span class="text-xs">CN</span>
          <span class="text-sm ml-2">简体中文</span>
        </a-menu-item>
        <a-menu-item key="en-US" :class="{'active-item':key==='en-US'}">
          <span class="text-xs">US</span>
          <span class="text-sm ml-2">English</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import {defineComponent, reactive, toRefs} from 'vue'
import {useStore} from 'vuex'
import {GlobalOutlined} from '@ant-design/icons-vue'
import {LOAD_LANGUAGE} from "@/store/actionTypes";

export default defineComponent({
  name: "Language",
  components: {GlobalOutlined},
  setup() {
    const store = useStore()

    const data = reactive({
      key: store.state.app.lang
    })

    const handleMenuClick = (item) => {
      data.key = item.key
      store.dispatch(LOAD_LANGUAGE, item.key)
    }

    return {
      handleMenuClick,
      ...toRefs(data)
    }
  }
})
</script>

<style scoped lang="stylus">
::v-deep(.active-item)
  background-color #fff1f0
  color #f5222d

</style>