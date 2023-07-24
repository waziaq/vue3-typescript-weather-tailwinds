import './style.css'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const head = createHead()
app.use(router).use(head)

app.mount('#app')
