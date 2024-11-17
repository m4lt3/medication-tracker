<script setup>
import { ref, watch } from 'vue';
import { useIndexedStore } from '@/store/indexed';
import { useI18n } from "vue-i18n";

import DeleteModal from '@/components/deleteModal.vue';

const { t } = useI18n();
const indexedStore = useIndexedStore();

const props = defineProps([ 'edit' ]);
const emit = defineEmits([ 'change' ]);

const feedback = ref({ visible: false });
const expanded = ref(null);
const group = ref({});

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
    group.value = JSON.parse(JSON.stringify(indexedStore.pillGroups[props.edit]));
    group.value.id = props.edit;
    expanded.value = 0;
  } else {
    group.value = {};
  }
})

async function save() {
  await form.value.validate();
  if (!valid.value) {
    return;
  }
  try {
    let entry = JSON.parse(JSON.stringify(group.value));
    if (entry.id) {
      let id = Number(entry.id);
      delete entry.id;
      await indexedStore.update("pillGroups", id, entry);

      emit('change');feedback.value = { visible: true, type: 'success', title: t('settings.pills.changes_saved_title'), text: t('settings.pills.changes_saved_title') };
    } else {
      await indexedStore.add("pillGroups", entry);
      feedback.value = { visible: true, type: 'success', title: t('settings.pills.group_added_title'), text: t('settings.pills.group_added_text') };
      emit('change');
    }
    group.value = {};
  } catch (e) {
    feedback.value = { visible: true, type: 'error', title: t('settings.pills.save_failed_title'), text: e.message };
  }
}

async function deleteGroup(id) {
  try {
    await indexedStore.remove("pillGroups", id);
    feedback.value = { visible: true, type: 'success', title: t('settings.pills.group_deleted_title'), text: '' };
    emit('change');
  } catch (e) {
    feedback.value = { visible: true, type: 'error', title: t('settings.pills.save_failed_title'), text: e.message };
  }
}

</script>
<template>
  <v-expansion-panels v-model="expanded">
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ $t('settings.pills.add_edit_group') }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="group.name" :label="$t('settings.pills.name')" :rules="[rules.required]"></v-text-field>
          <div class="d-flex">
            <v-btn color="blue" prepend-icon="mdi-content-save" @click="save" style="flex-grow: 3" >{{ $t('forms.save_action') }}</v-btn>
            <DeleteModal v-if="group.id" style="flex-grow: 1; margin-left: 4px;" @delete="deleteGroup(Number(group.id))"></DeleteModal>
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
