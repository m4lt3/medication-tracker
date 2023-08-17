<script setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';

import { handler as config } from '@/utils/ConfigHandler.js';
import { handler as db, storeNames } from '@/utils/DataHandler.js';

import { useIndexedStore } from '@/store/indexed';

import DecryptionModal from '@/components/decryptionModal.vue';

const indexedStore = useIndexedStore();

const importRequiresPassword = ref(false);
const importFile = ref([]);
const feedback = ref({ visible: false });
const importFileData = ref({});

const showDecryptionModal = ref(false);

async function parseImportFile() {
  if (importFile.value.length != 1) {
    importFileData.value = {};
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
</template>
