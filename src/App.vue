<script setup>
  import { handler as dh, storeNames } from '@/utils/DataHandler.js';

  dh.init();
</script>

<template>
  <router-view />
</template>
