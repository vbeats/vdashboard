import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import Avue from '@smallwei/avue'
import 'element-plus/dist/index.css'
import '@smallwei/avue/lib/index.css'
import './style.css'
import bootstrap from './bootstrap'

const app = createApp(App)

app.use(createPinia())
app.use(bootstrap)
app.use(ElementPlus)
app.use(Avue)

app.mount('#app')
