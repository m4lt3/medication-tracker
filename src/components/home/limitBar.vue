<script setup>
import { computed } from 'vue';
const props = defineProps([ 'ingredientInfo', 'currentValue', 'changes' ]);

const progress = computed(() => {
  return (props.currentValue / props.ingredientInfo.limit) * 100;
});

const progressColor = computed(() => {
  if (progress.value < 80) {
    return 'success'
  } else if (progress.value < 100) {
    return 'warning';
  } else {
    return 'error';
  }
});
</script>
<template>
  <p class="text-h4">{{ props.ingredientInfo.name }}</p>
  <v-progress-linear :model-value="progress" :color="progressColor" height="25rem">
    {{ props.currentValue }} of {{ props.ingredientInfo.limit }} mg
  </v-progress-linear>
  <p>In {{ props.changes.in }} you can take additional {{ props.changes.amount }} mg</p>
</template>
