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
  <v-container>
    <h1 class="text-h2">Import and Export</h1>
    <p>If you want to transfer your data to another device or want to have (or use) a backup, you can do so here</p>
    <p>If your local data is encrypted, your backup will also be encrypted, otherwise it will be in plain text. When importing an encrypted backup file, note that you will have to supply the password it was encrypted with, but from there on it will use the encryption settings of the new device.</p>
    <p>Manually editing the exported file can lead to permanent data loss.</p>
    <v-row>
      <v-col cols="12" md="6">
        <v-card
          prepend-icon="mdi-arrow-up-bold"
        >
          <template #title>
            Export
          </template>
          <v-card-text>
            <v-btn block color="primary" prepend-icon="mdi-arrow-up" @click="exportData">Export</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card
          prepend-icon="mdi-arrow-down-bold"
        >
        <template #title>
          Import
        </template>
          <v-card-text>
            <p>Keep in Mind that importing the data will erase existing data (apart from your encryption settings)</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
