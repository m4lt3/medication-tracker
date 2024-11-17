<script setup>
import ExportForm from '@/components/export/export.vue';
import ImportForm from '@/components/export/import.vue';
</script>
<template>
  <v-container>
    <h1 class="text-h2">{{ $t('settings.export.title') }}</h1>
    <p>{{ $t('settings.export.p1') }}</p>
    <p>{{ $t('settings.export.p2') }}</p>
    <p>{{ $t('settings.export.p3') }}</p>
    <v-row>
      <v-col cols="12" md="6">
        <ExportForm></ExportForm>
      </v-col>
      <v-col cols="12" md="6">
        <ImportForm></ImportForm>
      </v-col>
    </v-row>
  </v-container>
</template>
