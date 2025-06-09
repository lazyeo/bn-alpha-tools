import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// 引入国际化
import i18n from './locales/index.js'

// 引入Store
import { useBscStore } from './stores/bsc'

// 添加所有 Font Awesome 图标
library.add(fas)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)
app.component('font-awesome-icon', FontAwesomeIcon)

// 初始化 store
const bscStore = useBscStore()
bscStore.init()

app.mount('#app')
