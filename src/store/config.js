import { defineStore } from 'pinia';
import { ref, onMounted, watchEffect } from 'vue';
import { handler as configHandler } from '@/utils/ConfigHandler.js';

export const useConfigStore = defineStore('config', () => {
  const config = ref({});
  const password = ref('');

  onMounted(() => {
    config.value = configHandler.read();
    password.value = configHandler.getPassword();
  });

  watchEffect(() => {
    configHandler.write(config.value);
  });

  watchEffect(() => {
    configHandler.setPassword(password.value);
  });

  return { config, password };
});
