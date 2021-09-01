<template>
  <h1>index.......</h1>
  <div>{{ data }}</div>
  <h1>国际化测试</h1><br><br>
  <a-date-picker/>
  <a-button @click="changeLanguage">{{ t('btTest') }}</a-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from '@/util/request'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const data = ref()
const { t } = useI18n()

axios.post('/admin/user/test', { tt: ['xx', 'oo'] }).then(res => {
  data.value = res
})

const changeLanguage = () => {
  message.error('点击右上角切换')
}

</script>

<style scoped>

</style>
