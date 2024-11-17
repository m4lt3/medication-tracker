<script setup>
  import IntakeVisualizer from '@/components/home/intakeVisualizer.vue';

  const emit = defineEmits([ 'openDecryptionModal' ]);
</script>
<template>
  <v-container>
    <h1 class="text-h2">{{ $t('history.title') }}</h1>
  </v-container>
  <IntakeVisualizer showAll></IntakeVisualizer>
</template>
