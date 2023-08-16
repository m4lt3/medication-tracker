<script setup>
import { ref, watch } from 'vue';
import { useIndexedStore } from '@/store/indexed';

import DeleteModal from '@/components/deleteModal.vue';

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
    return "Required"
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

      emit('change');feedback.value = { visible: true, type: 'success', title: 'Changes saved!', text: 'Your changes have been saved' };
    } else {
      await indexedStore.add("pillGroups", entry);
      feedback.value = { visible: true, type: 'success', title: 'Group added!', text: 'You can now add Pills to this group' };
      emit('change');
    }
    group.value = {};
  } catch (e) {
    feedback.value = { visible: true, type: 'error', title: 'Something went wrong!', text: e.message };
  }
}

async function deleteGroup(id) {
  try {
    await indexedStore.remove("pillGroups", id);
    feedback.value = { visible: true, type: 'success', title: 'Group deleted!', text: '' };
    emit('change');
  } catch (e) {
    console.log(e);
    feedback.value = { visible: true, type: 'error', title: 'Something went wrong!', text: e.message };
  }
}

</script>
<template>
  <v-expansion-panels v-model="expanded">
    <v-expansion-panel>
      <v-expansion-panel-title>
        Add or Edit Group
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="group.name" label="name" :rules="[rules.required]"></v-text-field>
          <div class="d-flex">
            <v-btn color="blue" prepend-icon="mdi-content-save" @click="save" style="flex-grow: 3" >Save</v-btn>
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
