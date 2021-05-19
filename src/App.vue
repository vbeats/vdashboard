<template>
  <a-config-provider :locale="locale">
    <router-view/>
  </a-config-provider>
</template>

<script lang="ts">
import {defineComponent, ref, watchEffect} from 'vue'
import {useStore} from "vuex";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore()

    const locale = ref()

    watchEffect(() => {
      locale.value = store.state.app.lang === 'en-US' ? enUS : zhCN
    })

    return {
      locale
    }
  }
})
</script>

<style>
</style>
