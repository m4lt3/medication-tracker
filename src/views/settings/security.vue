<script setup>
import { ref } from 'vue';

import { handler as db } from '@/utils/DataHandler.js';

import { useIndexedStore } from '@/store/indexed';
import { useConfigStore } from '@/store/config';

import { AES } from 'crypto-js';

import DeleteModal from '@/components/deleteModal.vue';

const indexedStore = useIndexedStore();
const configStore = useConfigStore();

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
    return "Required";
  },
  minLength: (value) => {
    if (value.length > 7) {
      return true;
    }
    return "Must be at least 8 characters long";
  },
  samePassword: (value) => {
    if (password.value.new == password.value.confirm) {
      return true;
    }
    return "Passwords do not match";
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
    feedback.value = { visible: true, type: 'success', title: 'Encryption enabled', text: 'Your data is even more safe now!' };
  } catch (e) {
    configStore.config.encrypted = false;
    configStore.config.testPhrase = undefined;

    configStore.password = null;

    feedback.value = { visible: true, type: 'error', title: 'Something went wrong', text: e.message };
  }

}

async function decrypt() {
  await decryptionForm.value.validate();
  if (!dcValid.value) {
    return;
  }

  if (password.value.old != configStore.password) {
    feedback.value = { visible: true, type: 'error', title: 'Password incorrect', text: 'Your current Password is required for confirmation!' };
    return;
  }

  await db.decryptDB();

  configStore.config.encrypted = false;
  configStore.config.testphrase = undefined;
  configStore.password = null;

  feedback.value = { visible: true, type: 'success', title: 'Encryption disabled', text: 'No more annoying password prompts!' };
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
    <h1 class="text-h2">Security</h1>
    <p>This Application may store sensitive data about your medication intake. Thus, security is of utmost importance to us.</p>
    <p>Which pills you have taken is only stored as long as it is necessary to track a potential overdose. These time limits are checked at startup or can be refreshed manually.</p>
    <p>All your Data is stored locally and can only be accessed by accessing your device. <b>If you are in private browsing mode, your data will be erased after you close the browser</b></p>
    <p>Additionally, you can protect your information using a password. It will e encrypted before saving it to disk and we only store it in your browser while you use the app (session storage). If you forget your password, your information cannot be recovered.</p>
    <p>You can also purge all your saved data</p>
    <v-card
      class="my-3"
    >
      <v-card-item>
        <v-card-title>Your data is currently{{ configStore.config.encrypted ? ' ' : ' not ' }}encrypted</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-form ref="encryptionForm" v-model="ecValid" v-if="!configStore.config.encrypted">
          <v-text-field
            type="password"
            label="New Password"
            v-model="password.new"
            :rules="[rules.required, rules.minLength]"
          ></v-text-field>
          <v-text-field
            type="password"
            label="Confirm Password"
            v-model="password.confirm"
            :rules="[rules.required, rules.samePassword]"
          ></v-text-field>
          <v-btn block prepend-icon="mdi-lock-outline" @click="encrypt">Enable Encryption</v-btn>
        </v-form>
        <v-form ref="decryptionForm" v-model="dcValid" v-else>
          <v-text-field
            type="password"
            label="Current Password"
            v-model="password.old"
            :rules="[rules.required]"
          ></v-text-field>
          <v-btn block prepend-icon="mdi-lock-open-outline" @click="decrypt">Disable Encryption</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="my-3">
      <v-card-item>
        <v-card-title>
          Intake saving settings
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="configStore.config.intakeHistory"
            label="Keep my intakes saved beyond their expiration"
          ></v-switch>
        </v-card-text>
      </v-card-item>
    </v-card>
    <v-alert class="my-2" v-model="feedback.visible" v-bind="feedback" closable></v-alert>
    <DeleteModal style="width: 100%" text="Purge all data" @delete="purge"></DeleteModal>

  </v-container>
</template>
