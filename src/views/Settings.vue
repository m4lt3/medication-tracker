<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <v-navigation-drawer
    floating
    permanent
  >
    <v-list
      density="compact"
      nav
    >
      <v-list-item prepend-icon="mdi-chart-timeline" title="Manage Tracked Ingredients" :to="{ name: 'ingredients' }"></v-list-item>
      <v-list-item prepend-icon="mdi-pill-multiple" title="Manage Pills" :to="{ name: 'pills' }"></v-list-item>
      <v-list-item prepend-icon="mdi-lock-outline" title="Security" :to="{ name: 'security' }"></v-list-item>
      <v-list-item prepend-icon="mdi-swap-vertical-bold" title="Import and Export" :to="{ name: 'export' }"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container style="height: 100%">
    <router-view v-if="route.name != 'settings'"></router-view>
    <div v-else class="d-flex align-center justify-center flex-column" style="height: 100%  ">
      <v-icon color="grey" icon="mdi-wrench-cog" style="font-size:5em"></v-icon>
      <h1 class="text-h2">Settings</h1>
      <p class="text-subtitle-1">Please select an Option from the sidebar</p>
    </div>
  </v-container>
</template>
