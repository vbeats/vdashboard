import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router'
import ElementPlus from 'element-plus'
import Avue from '@smallwei/avue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@smallwei/avue/lib/index.css'
import 'element-plus/dist/index.css'
import bootstrap from './bootstrap'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import axios from "./util/request"
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(bootstrap, {})

app.use(ElementPlus, {
    locale: zhCn,
    message: {
        duration: 5000
    }
})

app.use(Avue, {
    axios,
    menuType: 'text',
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).mount('#app')
