<template>
  <a-dropdown placement="bottomRight">
    <span class="global">
      <GlobalOutlined class="lang-icon"/>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="zh-CN" :class="{active:key==='zh-CN'}">
          <span class="short">CN</span>
          <span class="text">简体中文</span>
        </a-menu-item>
        <a-menu-item key="en-US" :class="{active:key==='en-US'}">
          <span class="short">US</span>
          <span class="text">English</span>
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
.global
  width 50px
  height 64px
  display block
  text-align center
  cursor pointer

  .lang-icon
    width 16px
    height 16px
    color rgba(0, 0, 0, .65)

.active
  background-color #fff1f0
  color #f5222d

.short
  font-size 12px

.text
  font-size 14px
  margin-left 8px

</style>