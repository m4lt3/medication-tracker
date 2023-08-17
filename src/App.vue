<script setup>
  import { onMounted, ref } from 'vue';
  import { useIndexedStore } from '@/store/indexed';

  import { handler as config } from '@/utils/ConfigHandler.js';

  import DecryptionModal from '@/components/decryptionModal.vue';

  const indexedStore = useIndexedStore();

  const showDecryptionModal = ref(false);
  const testphrase = ref('');

  onMounted(() => {
    let cfg = config.read();
    if (cfg.encrypted) {
      testphrase.value = cfg.testphrase;
      showDecryptionModal.value = true;
      indexedStore.passwordRequired = true;
    } else {
      indexedStore.init();
    }
  });

  function unlock(password) {
    config.setPassword(password);
    indexedStore.passwordRequired = false;
    indexedStore.init();
    showDecryptionModal.value = false;
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
