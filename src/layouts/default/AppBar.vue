<script setup>
  import { RouterLink, useRoute } from 'vue-router';

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
    <router-link v-if="route.path.match(/^\/settings/) == null" :to="{ name: 'settings' }" style="margin-right: 1rem; color: grey">
      <v-icon icon="mdi-cog-outline"></v-icon>
    </router-link>
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
