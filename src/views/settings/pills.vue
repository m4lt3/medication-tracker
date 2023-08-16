<script setup>
import { ref } from 'vue'
import { useIndexedStore } from '@/store/indexed';

import GroupForm from '@/components/pills/groupForm.vue';

const indexedStore = useIndexedStore();
const editId = ref(null);

</script>
<template>
  <v-container>
    <h1 class="text-h2">Pills and Pill Groups</h1>
    <p>Here you can manage the different Pills you usually take and want to have available in your selection screen.</p>
    <p>You can use Pill groups for a better overview in your dorpdown. Other than that, they don't have much use.</p>
    <p>Pills can belong to a Group and can contain one or multiple of your tracked ingredients and on selecting, you can also decite between a whole or just half a pill.</p>
    <h2 class="text-h3">Pill Groups</h2>
    <GroupForm :edit="editId" @change="editId = null"></GroupForm>
    <v-table>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, id) in indexedStore.pillGroups" :key="id">
          <td>{{ group.name }}</td>
          <td><v-btn color="blue" variant="plain" icon="mdi-square-edit-outline" @click="editId = id"></v-btn></td>
        </tr>
      </tbody>
    </v-table>
    <h2 class="text-h3">Pills</h2>
  </v-container>
</template>
