import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'
import antd from 'ant-design-vue'
import './assets/css/index.css'
import bootstrap from './bootstrap'

bootstrap()

const app = createApp(App)

app.use(antd).use(store).use(router).use(i18n).mount('#app')
