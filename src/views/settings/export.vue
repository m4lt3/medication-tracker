<script setup>
import { ref } from 'vue';
import { handler as config } from '@/utils/ConfigHandler.js';
import { handler as db, storeNames } from '@/utils/DataHandler.js';

import CryptoJS from 'crypto-js';
import { useIndexedStore } from '@/store/indexed';

import DecryptionModal from '@/components/decryptionModal.vue';


const indexedStore = useIndexedStore();

const importRequiresPassword = ref(false);
const importFile = ref([]);
const feedback = ref({ visible: false });
const importFileData = ref({});

const showDecryptionModal = ref(false);


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

async function parseImportFile() {
  if (importFile.value.length != 1) {
    return;
  }

  try {
    importFileData.value = JSON.parse(await importFile.value[0].text());
    if (!importFileData.value.encryption || !importFileData.value.stores) {
      feedback.value = { visible: true, type: 'error', title: 'Unsuitable data file', text: 'The provided data file is missing critical information'};
      return;
    }
    if (importFileData.value.encryption.enabled) {
      importRequiresPassword.value = true;
      showDecryptionModal.value = true;
    }
  } catch (e) {
    feedback.value = { visible: true, type: 'error', title: 'Unsuitable data file', text: 'The provided data file does not contain valid JSON'};
  }
}

async function importData() {
  await db.purge();
  for (let storeName in storeNames) {
    for (let itemId in importFileData.value.stores[storeName]) {
      console.log("adding ", JSON.parse(JSON.stringify(importFileData.value.stores[storeName][itemId])))
      await indexedStore.add(storeName, JSON.parse(JSON.stringify(importFileData.value.stores[storeName][itemId])), Number(itemId));
    }
  }

  importFile.value = [];
  importFileData.value = {};
  feedback.value = { visible: true, type: 'success', title: 'Import successful', text: 'You can now access and edit your imported data on this device' };
}

function unlock(password) {
  showDecryptionModal.value = false;
  for (let store in importFileData.value.stores) {
    for (let itemId in importFileData.value.stores[store]) {
      importFileData.value.stores[store][itemId] = JSON.parse(CryptoJS.AES.decrypt(importFileData.value.stores[store][itemId], password).toString(CryptoJS.enc.Utf8));
    }
  }
  importRequiresPassword.value = false;
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
            <v-row>
              <v-col cols="12">
                <v-file-input
                  accept=".json"
                  label="medication tracker data file"
                  v-model="importFile"
                  @update:modelValue="parseImportFile"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row v-if="importRequiresPassword" @click="showDecryptionModal = true" style="cursor: pointer">
              <v-col cols="12" class="d-flex align-center justify-center">
                <v-icon icon="mdi-lock-open-outline"></v-icon> Enter Password
              </v-col>
            </v-row>
            <DecryptionModal
              @close="showDecryptionModal = false"
              @unlocked="unlock"
              :testphrase="importFileData.encryption ? importFileData.encryption.testphrase : ''"
              :show="showDecryptionModal"
            ></DecryptionModal>
            <v-alert class="my-2"  variant="tonal" v-model="feedback.visible" v-bind="feedback" closable></v-alert>
            <v-btn
              color="primary"
              block
              prepend-icon="mdi-arrow-down"
              @click="importData"
              :disabled="importFileData.stores == undefined || importRequiresPassword"
            >Import</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
