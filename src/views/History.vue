<script setup>
  import IntakeVisualizer from '@/components/home/intakeVisualizer.vue';

  const emit = defineEmits([ 'openDecryptionModal' ]);
</script>
<template>
  <v-container>
    <h1 class="text-h2">Intake History</h1>
  </v-container>
  <IntakeVisualizer showAll></IntakeVisualizer>
</template>
