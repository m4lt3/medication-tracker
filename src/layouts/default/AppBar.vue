<script setup>
  import { RouterLink, useRoute } from 'vue-router';

  import { useIndexedStore } from '@/store/indexed';

  const emit = defineEmits(['openDecryptionModal']);
  const indexedStore = useIndexedStore();
  const route = useRoute();
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <router-link :to="{ name: 'home' }">
        <v-icon icon="mdi-medication-outline"></v-icon>
        Medication-Tracker
      </router-link>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-badge dot color="error" v-if="indexedStore.passwordRequired" style="margin-right:1rem">
      <v-icon icon="mdi-lock-open-outline" @click="$emit('openDecryptionModal')"></v-icon>
    </v-badge>
    <div v-if="route.path.match(/^\/settings/) == null">
      <v-icon icon="mdi-refresh" style="margin-right: 1rem" @click="indexedStore.removeExpiredIntakes()"></v-icon>
      <router-link :to="{ name: 'settings' }" style="margin-right: 1rem; color: grey">
        <v-icon icon="mdi-cog-outline"></v-icon>
      </router-link>
    </div>

    <router-link v-else :to="{ name: 'home' }" style="margin-right: 1rem; color: grey">
      <v-icon icon="mdi-home-analytics"></v-icon>
    </router-link>

  </v-app-bar>
</template>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
