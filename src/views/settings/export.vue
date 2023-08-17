<script setup>
import ExportForm from '@/components/export/export.vue';
import ImportForm from '@/components/export/import.vue';
</script>
<template>
  <v-container>
    <h1 class="text-h2">Import and Export</h1>
    <p>If you want to transfer your data to another device or want to have (or use) a backup, you can do so here</p>
    <p>If your local data is encrypted, your backup will also be encrypted, otherwise it will be in plain text. When importing an encrypted backup file, note that you will have to supply the password it was encrypted with, but from there on it will use the encryption settings of the new device.</p>
    <p>Manually editing the exported file can lead to permanent data loss.</p>
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
