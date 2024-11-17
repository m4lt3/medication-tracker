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

// Internationalization
import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json';
import de from '@/locales/de.json';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    de
  }
});

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.use(i18n);
app.mount('#app')
