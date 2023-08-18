<script setup>
  import { onMounted, ref } from 'vue';
  import { useIndexedStore } from '@/store/indexed';

  import { handler as config } from '@/utils/ConfigHandler.js';

  import DecryptionModal from '@/components/decryptionModal.vue';

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
