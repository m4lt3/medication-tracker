<script setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';

import { useIndexedStore } from '@/store/indexed';

const indexedStore = useIndexedStore();

const props = defineProps(['testphrase', 'show']);
const emit = defineEmits(['close', 'unlocked']);
const password = ref('');

const feedback = ref({ visible: false });

const testphrase = import.meta.env.VITE_PASSWORD_TESTPHRASE;

function unlock() {
  let unlocked = CryptoJS.AES.decrypt(props.testphrase, password.value).toString(CryptoJS.enc.Utf8);
  if (unlocked == testphrase) {
    emit('unlocked', password.value);
  } else {
    feedback.value = { visible: true, type: 'error', title: 'Wrong password', text: 'The test to decrypt data did not succeed' };
  }
}
</script>
<template>
  <v-dialog
    persistent
    v-model="props.show"
    width="auto"
  >
    <v-card
      prepend-icon="mdi-lock-open-outline"
    >
      <template #title>
        Enter Password
      </template>
      <template #append>
        <v-icon icon="mdi-close" @click="$emit('close')"></v-icon>
      </template>
      <v-card-text>
        <v-text-field
          type="password"
          v-model="password"
        ></v-text-field>
        <v-alert class="my-2" variant="tonal" v-bind="feedback" v-model="feedback.visible" closable></v-alert>
        <v-btn block @click="unlock" prepend-icon="mid-lock-open-outline">Unlock Database</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
