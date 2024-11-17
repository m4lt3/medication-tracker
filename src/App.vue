<script setup>
  import { onMounted, ref } from 'vue';
  import { useIndexedStore } from '@/store/indexed';
  import { useI18n } from 'vue-i18n';

  import { handler as config } from '@/utils/ConfigHandler.js';

  import DecryptionModal from '@/components/decryptionModal.vue';

  const i18n = useI18n();
  const indexedStore = useIndexedStore();

  const showDecryptionModal = ref(false);
  const testphrase = ref('');

  onMounted(async () => {
    let cfg = config.read();
    if (cfg.encrypted) {
      testphrase.value = cfg.testphrase;
      showDecryptionModal.value = true;
      indexedStore.passwordRequired = true;
    } else {
      await indexedStore.init();
      await indexedStore.markOrDeleteExpiredIntakes();
    }

    if (cfg.lang) {
      i18n.locale.value = cfg.lang;
    } else {
      for (let lang of window.navigator.languages) {
        let la = lang.split('-')[0];
        if (i18n.availableLocales.includes(la)) {
          i18n.locale.value = la;
          break;
        }
      }
    }
  });

  async function unlock(password) {
    config.setPassword(password);
    indexedStore.passwordRequired = false;
    showDecryptionModal.value = false;

    await indexedStore.init();
    await indexedStore.markOrDeleteExpiredIntakes();
  }
</script>

<template>
  <DecryptionModal
    @close="showDecryptionModal = false"
    @unlocked="unlock"
    :testphrase="testphrase"
    :show="showDecryptionModal"
  ></DecryptionModal>
  <router-view @openDecryptionModal="showDecryptionModal = true" />
</template>
