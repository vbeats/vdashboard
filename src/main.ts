import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'
import antd from 'ant-design-vue'
import bootstrap from './bootstrap'
import './assets/css/index.css'

bootstrap()

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(antd)
  .mount('#app')
