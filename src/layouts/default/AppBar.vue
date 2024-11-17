<script setup>
  import { ref } from 'vue';
  import { RouterLink, useRoute } from 'vue-router';

  import { useIndexedStore } from '@/store/indexed';
  import { useConfigStore } from '@/store/config';

  const emit = defineEmits(['openDecryptionModal']);

  const indexedStore = useIndexedStore();
  const configStore = useConfigStore();

  const route = useRoute();

  const snackbar = ref(false);
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <router-link :to="{ name: 'home' }">
        <v-icon icon="mdi-medication-outline"></v-icon>
        {{ $t("app_bar.title") }}
      </router-link>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-badge dot color="error" v-if="indexedStore.passwordRequired" style="margin-right:1rem">
      <v-icon icon="mdi-lock-open-outline" @click="$emit('openDecryptionModal')"></v-icon>
    </v-badge>
    <div v-if="route.path.match(/^\/settings/) == null">
      <v-icon
        icon="mdi-refresh"
        style="margin-right: 1rem"
        @click="indexedStore.markOrDeleteExpiredIntakes(); snackbar = true"
      ></v-icon>
      <router-link v-if="configStore.config.intakeHistory && route.name != 'history'" :to="{ name: 'history' }" style="margin-right: 1rem">
        <v-icon icon="mdi-history"></v-icon>
      </router-link>
      <router-link v-if="route.name != 'home'" :to="{ name: 'home' }" style="margin-right: 1rem">
        <v-icon icon="mdi-home-analytics"></v-icon>
      </router-link>
      <router-link :to="{ name: 'settings' }" style="margin-right: 1rem; color: grey">
        <v-icon icon="mdi-cog-outline"></v-icon>
      </router-link>
    </div>

    <router-link v-else :to="{ name: 'home' }" style="margin-right: 1rem; color: grey">
      <v-icon icon="mdi-home-analytics"></v-icon>
    </router-link>

  </v-app-bar>
  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
  >
    {{ $t("app_bar.expired_update") }}
  </v-snackbar>
</template>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
