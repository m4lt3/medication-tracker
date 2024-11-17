<script setup>
import { ref } from 'vue';

const properties = defineProps({
  style: String,
  text: String,
  variant: {
    type: String,
    default: 'elevated'
  }
});
const emit = defineEmits(['delete']);

const show = ref(false);
</script>
<template>
  <v-dialog
    width="auto"
    v-model="show"
  >
    <template #activator="{ props }">
      <v-btn color="error" v-bind="props" :style="properties.style" :variant="properties.variant"><v-icon icon="mdi-delete-outline"></v-icon>{{ properties.text }}</v-btn>
    </template>
    <v-card
      width="auto"
    >
      <v-card-item>
        <v-card-title>{{ $t('modals.delete.title') }}</v-card-title>
      </v-card-item>
      <v-card-text>
        <p>{{ $t('modals.delete.p1') }}</p>
        <p>{{ $t('modals.delete.p2') }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="$emit('delete'); show = false">{{ $t('modals.delete.yes') }}</v-btn>
        <v-btn @click="show = false" color="secondary">{{ $t('modals.delete.nvm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
