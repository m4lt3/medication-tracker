<script setup>
import { ref } from 'vue';

const properties = defineProps({
  style: String,
  text: String,
  variant: {
    type: String,
    default: 'default'
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
        <v-card-title>Are you sure?</v-card-title>
      </v-card-item>
      <v-card-text>
        <p>You won't be able to recover deleted data</p>
        <p>Items referencing this entry must be deleted or altered first.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="$emit('delete'); show = false">Yes, delete</v-btn>
        <v-btn @click="show = false" color="secondary">Never mind</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
