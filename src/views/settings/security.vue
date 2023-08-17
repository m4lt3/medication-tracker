<script setup>
import { onMounted, ref } from 'vue';

import { handler as config } from '@/utils/ConfigHandler.js';
import { handler as db } from '@/utils/DataHandler.js';

import { AES } from 'crypto-js';


const conf = ref({});

const password = ref({});

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

onMounted(() => {
  loadConfig();
});

function loadConfig() {
  conf.value = config.read();
}

async function encrypt() {
  await encryptionForm.value.validate();
  if (!ecValid.value) {
    return;
  }

  // updating config and storing Password
  config.write({
    encrypted: true,
    testphrase: AES.encrypt(testphrase, password.value.new).toString()
  });

  config.setPassword(password.value.new);

  await db.encryptDB();
}
</script>
<template>
  <v-container>
    <h1 class="text-h2">Security</h1>
    <p>This Application may store sensitive data about your medication intake. Thus, security is of utmost importance to us.</p>
    <p>Which pills you have taken is only stored as long as it is necessary to track a potential overdose. These time limits are checked at startup or can be refreshed manually.</p>
    <p>All your Data is stored locally and can only be accessed by accessing your device. <b>If you are in private browsing mode, your data will be erased after you close the browser</b></p>
    <p>Additionally, you can protect your information using a password. It will e encrypted before saving it to disk and we only store it in your browser while you use the app (session storage). If you forget your password, your information cannot be recovered.</p>
    <v-card
      class="my-3"
    >
      <v-card-item>
        <v-card-title>Your data is currently{{ conf.encrypted ? ' ' : ' not ' }}encrypted</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-form ref="encryptionForm" v-model="ecValid" v-if="!conf.encrypted">
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
          <v-btn block prepend-icon="mdi-lock-outline" @click="encrypt">Lock</v-btn>
        </v-form>
        <v-form ref="decryptionForm" v-model="dcValid" v-else>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
