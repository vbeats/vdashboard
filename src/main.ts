import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router'
import ElementPlus from 'element-plus'
import Avue from '@smallwei/avue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@smallwei/avue/lib/index.css'
import './style.css'
import bootstrap from './bootstrap'

const app = createApp(App)

app.use(createPinia())
await bootstrap()

app.use(ElementPlus).use(Avue).use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
