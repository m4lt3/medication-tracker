<script setup>
import { handler as config } from '@/utils/ConfigHandler.js';
import { handler as db, storeNames } from '@/utils/DataHandler.js';

async function exportData() {
  let exportObj = {
    encryption: {
      enabled: config.read().encrypted,
      testphrase: config.read().testphrase
    },
    stores: { }
  };

  for (let storeName in storeNames) {
    exportObj.stores[storeName] = await db.getAllFrom(storeNames[storeName], false);
  }

  let a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj)));
  a.setAttribute('download', 'medicationTrackerData.json');

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
</script>
<template>
  <v-card
    prepend-icon="mdi-arrow-up-bold"
  >
    <template #title>
      {{ $t('settings.export.export.title') }}
    </template>
    <v-card-text>
      <p>{{ $t('settings.export.export.p1') }}</p>
      <v-btn block color="primary" prepend-icon="mdi-arrow-up" @click="exportData">{{ $t('settings.export.export.export_action') }}</v-btn>
    </v-card-text>
  </v-card>
</template>
