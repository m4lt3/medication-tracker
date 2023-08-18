/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

 // Registering serviceWorker
 import { registerServiceWorker } from '@/utils/ServiceRegister.js';
 registerServiceWorker();

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
