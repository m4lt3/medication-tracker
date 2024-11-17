<script setup>
import { ref } from 'vue';
import { useConfigStore } from '@/store/config';
import { useI18n } from 'vue-i18n';

const configStore = useConfigStore();
const { availableLocales, locale, t } = useI18n();

const availableLocalesSelect = [];
for (let locale of availableLocales) {
  availableLocalesSelect.push({ value: locale, title: t('locale', 1, { locale: locale }) });
}

function saveLang(lang) {
  configStore.config.lang = lang;
}
</script>
<template>
  <v-container>
    <h1 class="text-h2">{{ $t('settings.language.title') }}</h1>
    <v-select
      :items="availableLocalesSelect"
      v-model="locale"
      @update:modelValue="saveLang"
    ></v-select>
  </v-container>
</template>
