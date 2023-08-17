<script setup>
import { ref, computed } from 'vue';
import { useIndexedStore } from '@/store/indexed';

const emit = defineEmits(['change']);
const indexedStore = useIndexedStore();

const pillSelect = computed(() => {
  let options = [];

  for (let groupId in indexedStore.pillGroups) {
    options.push({ header: indexedStore.pillGroups[groupId].name });

    // filtering group items
    let counter = 0;
    for (let pillId in indexedStore.pills) {
      if (indexedStore.pills[pillId].group == groupId) {
        options.push({ title: indexedStore.pills[pillId].name, value: Number(pillId) });
        counter++;
      }
    }

    //removing groups with no pills
    if (counter == 0) {
      options.pop();
    }
  }

  // adding ungrouped pills
  let counter = 0;
  options.push({ header: 'Without Group' });
  for (let pillId in indexedStore.pills) {
    if (indexedStore.pills[pillId].group == undefined) {
      options.push({ title: indexedStore.pills[pillId].name, value: Number(pillId) });
      counter++;
    }
  }
  if (counter == 0) {
    options.pop();
  }

  return options;
});

const pill = ref({
  pill: null,
  half: false
});

const rules = {
  required: (value) => {
    if (value) {
      return true;
    }
    return "Required"
  }
}
const form = ref(null);
const valid = ref(false);

async function takePill() {
  await form.value.validate();
  if (!valid.value) {
    return
  }

  pill.value.takenAt = Date.now();

  await indexedStore.add('intakes', JSON.parse(JSON.stringify(pill.value)));

  form.value.reset();
}
</script>
<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="pill.pill"
          :items="pillSelect"
          :rules="[rules.required]"
        >
          <template #item="{ props, item }">
                  <v-list-subheader v-if="item.raw.header">
                      {{ item.raw.header }}
                  </v-list-subheader>
                  <v-divider v-else-if="item.raw.divider" />
                  <v-list-item v-else v-bind="props"></v-list-item>
              </template>
        </v-select>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-center">
        <v-btn-toggle v-model="pill.half" mandatory :rules="[rules.required]">
          <v-btn icon="mdi-pill" :value="false"></v-btn>
          <v-btn icon="mdi-pill-off" :value="true"></v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn color="primary" block @click="takePill"><v-icon icon="mdi-plus"></v-icon></v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
