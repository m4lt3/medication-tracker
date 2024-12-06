<script setup>
import { ref, watch, computed } from 'vue';
import { useIndexedStore } from '@/store/indexed';
import { useI18n } from "vue-i18n";

import DeleteModal from '@/components/deleteModal.vue';

const indexedStore = useIndexedStore();
const { t } = useI18n();

const props = defineProps([ 'edit' ]);
const emit = defineEmits([ 'change' ]);

const feedback = ref({ visible: false });
const expanded = ref(null);
const pill = ref({ contents: [] });
const newContent = ref({});

const groupSelect = computed(() => {
  let options = [];
  for (let group in indexedStore.pillGroups) {
    options.push({ title: indexedStore.pillGroups[group].name, value: Number(group) });
  }
  return options;
});

const ingredientSelect = computed(() => {
  let options = [];
  for (let category in indexedStore.categories) {
    let alreadyContained = pill.value.contents.some((elem) => {
      return elem.ingredient == category;
    });

    if (! alreadyContained) {
      options.push({ title: indexedStore.categories[category].name, value: Number(category) });
    }

  }
  return options;
});

const rules = {
  required: (value) => {
    if (value) {
      return true;
    }
    return t('forms.required');
  }
};
const form = ref(null);
const valid = ref(false);

watch(props, (newVal, oldVal) => {
  if (props.edit !== null) {
    pill.value = JSON.parse(JSON.stringify(indexedStore.pills[props.edit]));
    pill.value.id = props.edit;
    expanded.value = 0;
  } else {
    pill.value = { contents: [] };
  }
})

async function save() {
  await form.value.validate();
  if (!valid.value) {
    return;
  }

  if (pill.value.contents.length == 0) {
    feedback.value = { visible: true, type: 'error', title: t('settings.pills.no_ingredients_title'), text: t('settings.pills.no_ingredients_title') };
    return;
  }

  try {
    let entry = JSON.parse(JSON.stringify(pill.value));
    if (entry.group == null) {
      delete entry.group;
    }
    if (entry.id) {
      let id = Number(entry.id);
      delete entry.id;
      await indexedStore.update("pills", id, entry);
      feedback.value = { visible: true, type: 'success', title: t('settings.pills.changes_saved_title'), text: t('settings.pills.changes_saved_text') };
      emit('change');
    } else {
      await indexedStore.add("pills", entry);
      feedback.value = { visible: true, type: 'success', title: t('settings.pills.pill_added_title'), text: t('settings.pills.pill_added_text') };
      emit('change');
    }
    pill.value = { contents: [] };
  } catch (e) {
    console.error(e)
    feedback.value = { visible: true, type: 'error', title: t('settings.pills.save_failed_title'), text: e.message };
  }
}

async function deletePill(id) {
  try {
    await indexedStore.remove("pills", id);
    feedback.value = { visible: true, type: 'success', title: t('settings.pills.pill_deleted_title'), text:t('settings.pills.pill_deleted_text') };
    emit('change');
  } catch (e) {
    feedback.value = { visible: true, type: 'error', title: t('settings.pills.save_failed_title'), text: e.message };
  }
}

function removeIngredient(id) {
  pill.value.contents.splice(pill.value.contents.findIndex((elem) => {
    return elem.ingredient == id;
  }), 1)
}

function addNewContent() {
  if (!(newContent.value.ingredient && newContent.value.amount)) {
    return;
  }
  newContent.value.amount = Number(newContent.value.amount);

  pill.value.contents.push(JSON.parse(JSON.stringify(newContent.value)));
  newContent.value = {};
}

</script>
<template>
  <v-expansion-panels v-model="expanded">
    <v-expansion-panel>
      <v-expansion-panel-title>

      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="pill.name" label="name" :rules="[rules.required]"></v-text-field>
          <v-select :items="groupSelect" v-model="pill.group" :label="$t('settings.pills.group')" clearable></v-select>
          <v-table hover>
            <thead>
              <tr>
                <th>{{ $t('settings.pills.ingredient') }}</th>
                <th>{{ $t('settings.pills.amount') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ingredient in pill.contents" :key="'new-' + ingredient.ingredient">
                <td>{{ indexedStore.categories[ingredient.ingredient].name }}</td>
                <td>{{ ingredient.amount }} mg</td>
                <td><v-btn color="error" variant="plain" icon="mdi-close" @click="removeIngredient(ingredient.ingredient)"></v-btn></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <v-select
                    :label="$t('settings.pills.ingredient')"
                    v-model="newContent.ingredient"
                    :items="ingredientSelect"
                    hide-details
                    density="compact"
                  ></v-select>
                </td>
                <td>
                  <v-text-field
                    :label="$t('settings.pills.amount') + ' (mg)'"
                    type="number"
                    min="0"
                    v-model="newContent.amount"
                    hide-details
                    density="compact"
                  ></v-text-field>
                </td>
                <td><v-btn color="success" variant="plain" icon="mdi-plus" @click="addNewContent"></v-btn></td>
              </tr>
            </tfoot>
          </v-table>
          <div class="d-flex mt-2">
            <v-btn color="blue" prepend-icon="mdi-content-save" @click="save" style="flex-grow: 3" >{{$t('forms.save_action') }}</v-btn>
            <DeleteModal v-if="pill.id" style="flex-grow: 1; margin-left: 4px;" @delete="deletePill(Number(pill.id))"></DeleteModal>
          </div>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-alert
    v-model="feedback.visible"
    v-bind="feedback"
    closable
    class="my-2"
  >
  </v-alert>
</template>
