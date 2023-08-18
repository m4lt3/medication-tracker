<script setup>
import { computed } from 'vue';
import { useIndexedStore } from '@/store/indexed';

import DeleteModal from '@/components/deleteModal.vue';

const indexedStore = useIndexedStore();

const sortedIntakes = computed(() => {
  let intakes = [];
  for (let itemId in indexedStore.intakes) {
    let tmp = indexedStore.intakes[itemId];
    tmp.id = itemId;
    intakes.push(tmp);
  }

  intakes.sort((a, b)  => {
    return b.takenAt - a.takenAt;
  });

  return intakes;
});

function removeIntake(id) {
  indexedStore.remove('intakes', Number(id));
}

</script>
<template>
  <v-timeline
    direction="vertical"
  >
    <v-timeline-item v-for="intake in sortedIntakes" :key="intake.id">
      <template #opposite>
        <p class="text-caption">{{ (new Date(intake.takenAt)).toLocaleString() }}</p>
      </template>
      <v-card width="fit-content">
        <template #append>

        </template>
        <v-card-text>
          <p class="text-overline">
            {{ indexedStore.pills[intake.pill].name }}
            <v-icon icon="mdi-circle-half-full" v-if="intake.half"></v-icon>
            <DeleteModal @delete="removeIntake(intake.id)"></DeleteModal>
          </p>
          <v-list>
            <v-list-item v-for="ingredient in indexedStore.pills[intake.pill].contents" :key="intake.id + '-' + ingredient.ingredient">
              <v-list-item-title>{{ intake.half ? ingredient.amount / 2 : ingredient.amount }} mg</v-list-item-title>
              <v-list-item-subtitle>{{ indexedStore.categories[ingredient.ingredient].name }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>
