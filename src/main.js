import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebase'

import App from './App.vue'
import router from './router'

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(createPinia()).use(router).mount('#app')
  }
})
