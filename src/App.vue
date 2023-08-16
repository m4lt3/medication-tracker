<script setup>
  import { onMounted } from 'vue';
  import { useIndexedStore } from '@/store/indexed';

  const indexedStore = useIndexedStore();

  onMounted(() => {
    indexedStore.init();
  });
  
</script>

<template>
  <router-view />
</template>
