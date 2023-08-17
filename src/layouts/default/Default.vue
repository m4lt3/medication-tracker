<template>
  <v-app>
    <default-bar @openDecryptionModal="$emit('openDecryptionModal')" />

    <default-view />
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'

  const emit = defineEmits(['openDecryptionModal']);
</script>
