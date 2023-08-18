<script setup>
import { computed } from 'vue';
import { useIndexedStore } from '@/store/indexed';

const indexedStore = useIndexedStore();
const props = defineProps([ 'ingredientInfo', 'ingredientId' ]);

const progress = computed(() => {
  return (currentIntake.value / props.ingredientInfo.limit) * 100;
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

const relevantIntakes = computed(() => {
  let intakes = [];
  for (let itemId in indexedStore.intakes) {
    let containsRelevantIngredient = indexedStore.pills[indexedStore.intakes[itemId].pill].contents.some((elem) => {
      if (elem.ingredient == props.ingredientId) {
        if (indexedStore.intakes[itemId].expired && indexedStore.intakes[itemId].expired.includes(elem.ingredient)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    });

    if (!containsRelevantIngredient) {
      continue;
    }

    let tmp = {
      takenAt: indexedStore.intakes[itemId].takenAt
    };

    let relevantIngredient = indexedStore.pills[indexedStore.intakes[itemId].pill].contents.find((elem) => { return elem.ingredient == props.ingredientId });

    tmp.amount = indexedStore.intakes[itemId].half ? relevantIngredient.amount / 2 : relevantIngredient.amount;

    intakes.push(tmp);
  }

  intakes.sort((a, b)  => {
    return b.takenAt - a.takenAt;
  });

  return intakes;
});

const currentIntake = computed(() => {
  let sum = 0;
  for (let intake of relevantIntakes.value) {
    sum += intake.amount;
  }

  return sum;
});

const nextIntake = computed(() => {
  if (relevantIntakes.value.length == 0) {
    return { at: Date.now(), amount: props.ingredientInfo.limit }
  }

  let relevantIntake = relevantIntakes.value[relevantIntakes.value.length - 1];

  return {
    at: relevantIntake.takenAt + props.ingredientInfo.expires,
    amount: relevantIntake.amount
  };
});

</script>
<template>
  <p class="text-h4">{{ props.ingredientInfo.name }}</p>
  <v-progress-linear :model-value="progress" :color="progressColor" height="25rem">
    {{ currentIntake }} of {{ props.ingredientInfo.limit }} mg
  </v-progress-linear>
  <p class="text-caption" v-if="relevantIntakes.length > 0">-{{ nextIntake.amount }} mg at {{ (new Date(nextIntake.at)).toLocaleString() }}</p>
</template>
