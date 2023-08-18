<script setup>
import { computed } from 'vue';
import { useIndexedStore } from '@/store/indexed';

import DeleteModal from '@/components/deleteModal.vue';

const props = defineProps({
  showAll: Boolean
});

const indexedStore = useIndexedStore();

const sortedIntakes = computed(() => {
  let intakes = [];
  for (let itemId in indexedStore.intakes) {
    let tmp = JSON.parse(JSON.stringify(indexedStore.intakes[itemId]));
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

function calculateIntakeDisplay(intake) {
  if (props.showAll) {
    return true;
  }

  if (!intake.expired) {
    return true;
  }

  if (intake.expired.length < indexedStore.pills[intake.pill].contents.length) {
    return true;
  }

  return false;
}

</script>
<template>
  <v-timeline
    direction="vertical"
  >
    <template v-for="intake in sortedIntakes" :key="intake.id">
      <v-timeline-item v-if="calculateIntakeDisplay(intake)">
        <template #opposite>
          <p class="text-caption">{{ (new Date(intake.takenAt)).toLocaleString() }}</p>
        </template>
        <v-card width="fit-content">
          <v-card-text>
            <p class="text-overline">
              {{ indexedStore.pills[intake.pill].name }}
              <v-icon icon="mdi-circle-half-full" v-if="intake.half"></v-icon>
              <DeleteModal @delete="removeIntake(intake.id)" variant="plain"></DeleteModal>
            </p>
            <v-list>
              <template v-for="ingredient in indexedStore.pills[intake.pill].contents" :key="intake.id + '-' + ingredient.ingredient">
                <v-list-item v-if="props.showAll || !intake.expired || !intake.expired.includes(ingredient.ingredient)">
                  <v-list-item-title>{{ intake.half ? ingredient.amount / 2 : ingredient.amount }} mg</v-list-item-title>
                  <v-list-item-subtitle>{{ indexedStore.categories[ingredient.ingredient].name }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>
