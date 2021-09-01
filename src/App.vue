<template>
  <a-config-provider :locale="locale">
    <router-view/>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'

const store = useStore()

const locale = ref()

watchEffect(() => {
  locale.value = store.state.app.lang === 'en-US' ? enUS : zhCN
})

</script>

<style lang="stylus" scoped>

</style>
