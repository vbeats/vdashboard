<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
<script lang="ts" setup>
import {ref, watchEffect} from 'vue'
import {useStore} from 'vuex'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const store = useStore()

const locale = ref()

watchEffect(() => {
  const lang = store.state.app.lang
  locale.value = lang === 'en-US' ? enUS : zhCN
  dayjs.locale(lang === 'en-US' ? 'en' : 'zh-cn')
})
</script>

<style lang="stylus"></style>
