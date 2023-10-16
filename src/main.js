import { createApp } from 'vue'
import "./assets/main.css"
import App from './App.vue'
import router from './router'


const vueApp = createApp(App);
vueApp.use(router);

vueApp.mount('#app');
