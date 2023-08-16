<script setup>
  import { handler as db, storeNames } from '@/utils/DataHandler.js';

  db.init().then(() => {
    for (let storeName in storeNames) {
      db.sanitizeStore(storeNames[storeName]);
    }

  });
</script>

<template>
  <router-view />
</template>
