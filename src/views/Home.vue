<script setup>
import { useIndexedStore } from '@/store/indexed';

import LimitBar from '@/components/home/limitBar.vue';
import IntakeForm from '@/components/home/intakeForm.vue';
import IntakeVisualizer from '@/components/home/intakeVisualizer.vue';

const indexedStore = useIndexedStore();
</script>
<template>
  <v-container>
    <h1 class="text-h2">Current values</h1>
    <LimitBar
      v-for="(ingredient, id) in indexedStore.categories"
      :key="id"
      :ingredientInfo="ingredient"
      currentValue="700"
      :changes="{ amount:50, in: '13 minutes' }"
    ></LimitBar>
    <h1 class="text-h2">Intakes</h1>
    <IntakeForm></IntakeForm>
    <IntakeVisualizer></IntakeVisualizer>
  </v-container>
</template>
