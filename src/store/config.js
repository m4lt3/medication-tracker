import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';
import { handler as configHandler } from '@/utils/ConfigHandler.js';

export const useConfigStore = defineStore('config', () => {
  const config = ref(configHandler.read());
  const password = ref(configHandler.getPassword());

  watchEffect(() => {
    configHandler.write(config.value);
  });

  watchEffect(() => {
    configHandler.setPassword(password.value);
  });

  return { config, password };
});
