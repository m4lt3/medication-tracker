<template>
  <v-main>
    <router-view @openDecryptionModal="$emit('openDecryptionModal')" />
  </v-main>
</template>

<script setup>
  const emit = defineEmits(['openDecryptionModal']);
</script>
