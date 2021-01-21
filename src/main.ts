import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import './mock'

createApp(App)
    .use(Antd)
    .use(store)
    .use(router)
    .mount('#app')
