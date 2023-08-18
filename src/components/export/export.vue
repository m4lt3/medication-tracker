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
      Export
    </template>
    <v-card-text>
      <p>Keep in Mind that only your Data will be exported (encrypted or unencrypted). Settings such as intake history will not be transferred</p>
      <v-btn block color="primary" prepend-icon="mdi-arrow-up" @click="exportData">Export</v-btn>
    </v-card-text>
  </v-card>
</template>
