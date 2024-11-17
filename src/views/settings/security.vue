<script setup>
import { ref } from 'vue';

import { handler as db } from '@/utils/DataHandler.js';

import { useIndexedStore } from '@/store/indexed';
import { useConfigStore } from '@/store/config';
import { useI18n } from "vue-i18n";

import { AES } from 'crypto-js';

import DeleteModal from '@/components/deleteModal.vue';

const indexedStore = useIndexedStore();
const configStore = useConfigStore();
const { t } = useI18n();

const password = ref({});

const feedback = ref({ visible: false });

const testphrase = import.meta.env.VITE_PASSWORD_TESTPHRASE;

const encryptionForm = ref(null);
const decryptionForm = ref(null);
const ecValid = ref(false);
const dcValid = ref(false);

const rules = {
  required: (value) => {
    if (value) {
      return true;
    }
    return t('forms.required');
  },
  minLength: (value) => {
    if (value.length > 7) {
      return true;
    }
    return t('forms.min_8');
  },
  samePassword: (value) => {
    if (password.value.new == password.value.confirm) {
      return true;
    }
    return t('forms.password_mismatch');
  }
};

async function encrypt() {
  await encryptionForm.value.validate();
  if (!ecValid.value) {
    return;
  }

  // updating config and storing Password
  configStore.config.encrypted = true;
  configStore.config.testphrase = AES.encrypt(testphrase, password.value.new).toString();

  configStore.password = password.value.new;

  try {
    await db.encryptDB();
    feedback.value = { visible: true, type: 'success', title: t('settings.security.encryption_enabled_title'), text: t('settings.security.encryption_enabled_text') };
  } catch (e) {
    configStore.config.encrypted = false;
    configStore.config.testPhrase = undefined;

    configStore.password = null;

    feedback.value = { visible: true, type: 'error', title: t('settings.security.error'), text: e.message };
  }

}

async function decrypt() {
  await decryptionForm.value.validate();
  if (!dcValid.value) {
    return;
  }

  if (password.value.old != configStore.password) {
    feedback.value = { visible: true, type: 'error', title: t('settings.security.password_incorrect_title'), text: t('settings.security.password_incorrect_text') };
    return;
  }

  await db.decryptDB();

  configStore.config.encrypted = false;
  configStore.config.testphrase = undefined;
  configStore.password = null;

  feedback.value = { visible: true, type: 'success', title: t('settings.security.encryption_disabled_title'), text: t('settings.security.encryption_disabled_text') };
}

async function purge() {
  await indexedStore.purge();

  configStore.config = {};
  configStore.password = null;

  indexedStore.init();
  indexedStore.passwordRequired = false;
}
</script>
<template>
  <v-container>
    <h1 class="text-h2">{{ $t("settings.security.title") }}</h1>
    <p>{{ $t("settings.security.p1") }}</p>
    <p>{{ $t("settings.security.p2") }}</p>
    <p>{{ $t("settings.security.p3") }} <b>{{ $t("settings.security.p3b") }}</b></p>
    <p>{{ $t("settings.security.p4") }}</p>
    <p>{{ $t("settings.security.p5") }}</p>
    <v-card
      class="my-3"
    >
      <v-card-item>
        <v-card-title>{{ $t('settings.security.data_is') }}{{ configStore.config.encrypted ? ' ' : ' ' + $t('settings.security.not') }} {{ $t('settings.security.encrypted') }}</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-form ref="encryptionForm" v-model="ecValid" v-if="!configStore.config.encrypted">
          <v-text-field
            type="password"
            :label="$t('settings.security.new_pw')"
            v-model="password.new"
            :rules="[rules.required, rules.minLength]"
          ></v-text-field>
          <v-text-field
            type="password"
            :label="$t('settings.security.confirm_pw')"
            v-model="password.confirm"
            :rules="[rules.required, rules.samePassword]"
          ></v-text-field>
          <v-btn block prepend-icon="mdi-lock-outline" @click="encrypt">{{ $t('settings.security.enable_encryption') }}</v-btn>
        </v-form>
        <v-form ref="decryptionForm" v-model="dcValid" v-else>
          <v-text-field
            type="password"
            :label="$t('settings.security.current_pw')"
            v-model="password.old"
            :rules="[rules.required]"
          ></v-text-field>
          <v-btn block prepend-icon="mdi-lock-open-outline" @click="decrypt">{{ $t('settings.security.disable_encryption') }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="my-3">
      <v-card-item>
        <v-card-title>
          {{ $t('settings.security.intake_history') }}
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="configStore.config.intakeHistory"
            :label="$t('settings.security.save_beyond')"
          ></v-switch>
        </v-card-text>
      </v-card-item>
    </v-card>
    <v-alert class="my-2" v-model="feedback.visible" v-bind="feedback" closable></v-alert>
    <DeleteModal style="width: 100%" :text="$t('settings.security.purge')" @delete="purge"></DeleteModal>

  </v-container>
</template>
