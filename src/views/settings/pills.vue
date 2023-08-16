<script setup>
import { ref } from 'vue'
import { useIndexedStore } from '@/store/indexed';

import GroupForm from '@/components/pills/groupForm.vue';
import PillForm from '@/components/pills/pillForm.vue';

const indexedStore = useIndexedStore();
const editGroupId = ref(null);
const editPillId = ref(null);

</script>
<template>
  <v-container>
    <h1 class="text-h2">Pills and Pill Groups</h1>
    <p>Here you can manage the different Pills you usually take and want to have available in your selection screen.</p>
    <p>You can use Pill groups for a better overview in your dorpdown. Other than that, they don't have much use.</p>
    <p>Pills can belong to a Group and can contain one or multiple of your tracked ingredients and on selecting, you can also decite between a whole or just half a pill.</p>
    <h2 class="text-h3">Pill Groups</h2>
    <GroupForm :edit="editGroupId" @change="editGroupId = null"></GroupForm>
    <v-table hover>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, id) in indexedStore.pillGroups" :key="id">
          <td>{{ group.name }}</td>
          <td><v-btn color="blue" variant="plain" icon="mdi-square-edit-outline" @click="editGroupId = id"></v-btn></td>
        </tr>
      </tbody>
    </v-table>
    <h2 class="text-h3">Pills</h2>
    <PillForm :edit="editPillId" @change="editPillId = null"></PillForm>
    <v-table hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Group</th>
          <th>Ingredients</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pill, id) in indexedStore.pills" :key="id">
          <td>{{ pill.name }}</td>
          <td>{{ pill.group ? indexedStore.pillGroups[pill.group].name : '' }}</td>
          <td>
            <v-list-item
              v-for="ingredient in pill.contents"
              :key="id + '-' + ingredient.ingredient"
              :title="indexedStore.categories[ingredient.ingredient].name"
              :subtitle="ingredient.amount + ' mg'"
            ></v-list-item>
          </td>
          <td><v-btn color="blue" variant="plain" icon="mdi-square-edit-outline" @click="editPillId = Number(id)"></v-btn></td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
