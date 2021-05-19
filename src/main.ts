import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'
import Antd from 'ant-design-vue'
import bootstrap from "./bootstrap"
import 'ant-design-vue/dist/antd.css'
import './assets/css/index.css'

bootstrap() // 初始化数据

const app = createApp(App)
app.use(Antd)
    .use(store)
    .use(i18n)
    .use(router)
    .mount('#app')
