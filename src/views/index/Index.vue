<template>
  <h1>index.......</h1>
  <h1>国际化测试</h1>
  <br /><br />
  <a-date-picker />
  <br />
  <div class="mt-10">{{ t('btTest') }} -- 当前语言环境: {{ locale }}</div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useStore} from 'vuex'

const {t, locale} = useI18n()
const store = useStore()
</script>

<style scoped></style>
