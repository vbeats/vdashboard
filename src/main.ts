import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'
import bootstrap from './bootstrap'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/css/index.css'

bootstrap()

const app = createApp(App)

app.use(Antd).use(store).use(router).use(i18n).mount('#app')
