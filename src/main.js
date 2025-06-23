import {createApp} from 'vue'
import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'

import router from './js/router.js'

const app = createApp(App);
app.use(PrimeVue, {
    theme: {preset: Aura}
});
app.use(ToastService);
app.use(router);
app.mount('#app');