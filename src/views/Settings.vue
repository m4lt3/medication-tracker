<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const emit = defineEmits(['openDecryptionModal']);
</script>

<template>
  <v-navigation-drawer
    floating
    permanent
    rail
    expand-on-hover
  >
    <v-list
      density="compact"
      nav
    >
      <v-list-item prepend-icon="mdi-chart-timeline" :title="$t('settings.navbar.ingredients')" :to="{ name: 'ingredients' }"></v-list-item>
      <v-list-item prepend-icon="mdi-pill-multiple" :title="$t('settings.navbar.pills')" :to="{ name: 'pills' }"></v-list-item>
      <v-list-item prepend-icon="mdi-lock-outline" :title="$t('settings.navbar.security')" :to="{ name: 'security' }"></v-list-item>
      <v-list-item prepend-icon="mdi-swap-vertical-bold" :title="$t('settings.navbar.import_export')" :to="{ name: 'export' }"></v-list-item>
      <v-list-item prepend-icon="mdi-translate" :title="$t('settings.navbar.language')" :to="{ name: 'language'}"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container style="height: 100%">
    <router-view v-if="route.name != 'settings'"></router-view>
    <div v-else class="d-flex align-center justify-center flex-column" style="height: 100%  ">
      <v-icon color="grey" icon="mdi-wrench-cog" style="font-size:5em"></v-icon>
      <h1 class="text-h2">{{ $t('settings.title') }}</h1>
      <p class="text-subtitle-1">{{ $t('settings.select') }}</p>
    </div>
  </v-container>
</template>
