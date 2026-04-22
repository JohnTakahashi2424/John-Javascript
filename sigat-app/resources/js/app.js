import './bootstrap';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js'; // Referencia al router que creamos

// Crear la instancia de la aplicación Vue
const app = createApp(App);

// Usar el enrutador
app.use(router);

// Montar la aplicación en el div con id "app" de welcome.blade.php
app.mount('#app');
