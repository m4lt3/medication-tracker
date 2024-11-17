<script setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';

import { useIndexedStore } from '@/store/indexed';
import { useI18n } from "vue-i18n";

const indexedStore = useIndexedStore();
const { t } = useI18n();

const props = defineProps(['testphrase', 'show']);
const emit = defineEmits(['close', 'unlocked']);
const password = ref('');

const feedback = ref({ visible: false });

const testphrase = import.meta.env.VITE_PASSWORD_TESTPHRASE;

function unlock() {
  let unlocked = CryptoJS.AES.decrypt(props.testphrase, password.value).toString(CryptoJS.enc.Utf8);
  if (unlocked == testphrase) {
    emit('unlocked', password.value);
    password.value = '';
  } else {
    feedback.value = { visible: true, type: 'error', title: t('modals.decrypt.wrong_password_title'), text: t('modals.decrypt.wrong_password_text') };
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
        {{ $t('modals.decrypt.title') }}
      </template>
      <template #append>
        <v-icon icon="mdi-close" @click="$emit('close')"></v-icon>
      </template>
      <v-card-text>
        <v-text-field
          type="password"
          v-model="password"
          @keyup.enter="unlock"
        ></v-text-field>
        <v-alert class="my-2" variant="tonal" v-bind="feedback" v-model="feedback.visible" closable></v-alert>
        <v-btn block @click="unlock" prepend-icon="mid-lock-open-outline">{{ $t('modals.decrypt.unlock') }}</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
