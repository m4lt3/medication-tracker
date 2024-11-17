<script setup>
import { ref, watch } from 'vue';
import { useIndexedStore } from '@/store/indexed';
import { useI18n } from "vue-i18n";

import DeleteModal from '@/components/deleteModal.vue';

const { t } = useI18n();
const indexedStore = useIndexedStore();

const feedback = ref({ visible: false});

const panelExpanded = ref();
const category = ref({ expiresUnit: 'minute', expiresAmount: 0 });
const categoryForm = ref(null);
const formValid = ref(false);

const rules = {
  required: (value) => {
    if (value) {
      return true;
    }
    return t('forms.required');
  }
};

const bufferChanged = ref(false);
const amount = ref(0);
const unit = ref("minute");
const ms = {
  minute: 60000,
  hour: 3600000,
  day: 86400000
}

async function save() {
  await categoryForm.value.validate();
  if (!formValid) {
    return;
  }

  let entry = JSON.parse(JSON.stringify(category.value));

  entry.limit = Number(entry.limit);
  entry.expires = convertUnitsToMs(entry);
  delete entry.expiresAmount;
  delete entry.expiresUnit;


  if (category.value.id) {
    let id = Number(entry.id);
    delete entry.id;
    indexedStore.update("categories", id, entry);
    feedback.value = { visible: true, type: 'success', title: t('settings.ingredients.changes_saved_title'), message: t('settings.ingredients.changes_saved_text')};
  } else {
    indexedStore.add("categories", entry);
    feedback.value = { visible: true, type: 'success', title: t('settings.ingredients.ingredient_added_title'), message: t('settings.ingredients.ingredient_added_text')};
  }
  category.value = {};
}

function edit(pCategory, id) {
  category.value = JSON.parse(JSON.stringify(pCategory));
  category.value.id = id;
  panelExpanded.value = 0;
}

function convertMsToUnits(entry) {
  let unit, amount;
  let testUnits = ["minute", "hour", "day"];
  let unitIndex = 0;

  //detecting what is an appropriate unit size
  for (let index in testUnits ) {
    if (ms[testUnits[index]] > entry.expires) {
      unitIndex = Math.max(0, index - 1);
      break;
    }
  }

  unit = testUnits[unitIndex];

  // detecting amount of that unit
  let tempAmount = 0;
  let buffer = Number(entry.expires.toString())
  while (buffer > ms[testUnits[unitIndex]]) {
    tempAmount++;
    buffer -= ms[testUnits[unitIndex]];
  }
  if (buffer > 0) {
    tempAmount += buffer / ms[testUnits[unitIndex]];
  }
  amount = tempAmount;

  return [ amount, unit ];
}

function convertUnitsToMs() {
  return ms[category.value.expiresUnit] * category.value.expiresAmount;
}

function generateTimeText(entry) {
  let [amount, unit] = convertMsToUnits(entry);
  let s = (amount != 1 ? 's' : '');

  return `${amount} ${unit}${s}`;
}

watch(category, (newVal, oldVal) => {
  if (category.value.expires !== undefined) {
    let [amount, unit] = convertMsToUnits(category.value);

    category.value.expiresAmount = amount;
    category.value.expiresUnit = unit;
  }
});

function deleteCategory(id) {
  try {
    indexedStore.remove("categories", id);
    feedback.value = { visible: true, type: 'success', title: t('settings.ingredients.ingredient_deleted_success_title'), message: t('settings.ingredients.ingredient_deleted_success_text') };
    category.value = {};
  } catch (e) {
    feedback.value = { visible: true, type: 'error', title: t('settings.ingredients.ingredient_deleted_fail_title'), message: e};
  }
}
</script>
<template>
  <h1 class="text-h2">{{ $t('settings.ingredients.title') }}</h1>
  <p>
    {{ $t('settings.ingredients.p1') }}
  </p>
  <p>
    {{ $t('settings.ingredients.p2') }}
  </p>
  <v-list>
    <v-list-item
      v-for="(item, index) in [{ subtitle: $t('settings.ingredients.name'), title: 'Ibuprofen' }, { subtitle: $t('settings.ingredients.limit'), title: '800' }, { subtitle: $t('settings.ingredients.in_body'), title: $t('settings.ingredients.6_hour_example') }]"
      :key="index"
      :title="item.title"
      :subtitle="item.subtitle"
    >
    </v-list-item>
  </v-list>
  <p>
    {{ $t('settings.ingredients.p3') }}
  </p>
  <v-expansion-panels class="mt-2" v-model="panelExpanded">
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ $t('settings.ingredients.edit_add') }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="categoryForm" v-model="formValid">
          <v-text-field
            :label="$t('settings.ingredients.name')"
            v-model="category.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            :label="$t('settings.ingredients.limit') + ' (mg)'"
            v-model="category.limit"
            type="number"
            min="0"
            :rules="[rules.required]"
          ></v-text-field>
          <v-row>
            <v-col cols="6">
              <v-text-field
                :label="$t('settings.ingredients.in_body')"
                v-model="category.expiresAmount"
                type="number"
                min="0"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                :items="[{ title:$t('settings.ingredients.minutes'), value: 'minute' }, { title:$t('settings.ingredients.hours'), value: 'hour' }, { title:$t('settings.ingredients.days'), value: 'day' }]"
                v-model="category.expiresUnit"
                class="mx-1"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
          </v-row>
          <div class="d-flex flex-row flex-wrap">
            <v-btn @click="save" color="blue" prepend-icon="mdi-content-save" style="flex-grow: 3">{{ $t('settings.ingredients.save_action') }}</v-btn>
            <DeleteModal v-if="category.id" style="flex-grow: 1; margin-left: 4px;" @delete="deleteCategory(category.id)"></DeleteModal>
          </div>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-alert v-model="feedback.visible" :type="feedback.type" :title="feedback.title" :text="feedback.message" class="my-2" closable></v-alert>
  <v-table
    hover
  >
    <thead>
      <tr>
        <th>{{ $t('settings.ingredients.name') }}</th>
        <th>{{ $t('settings.ingredients.limit') }}</th>
        <th>{{ $t('settings.ingredients.period') }}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(category, id) in  indexedStore.categories" :key="id">
        <td>{{ category.name }}</td>
        <td>{{ category.limit }} mg</td>
        <td>{{ generateTimeText(category) }}</td>
        <td><v-btn color="blue" variant="plain" icon="mdi-square-edit-outline" @click="edit(category, id)"></v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>
