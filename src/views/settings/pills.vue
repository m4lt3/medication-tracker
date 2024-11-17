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
    <h1 class="text-h2">{{ $t('settings.pills.title') }}</h1>
    <p>{{ $t('settings.pills.p1') }}</p>
    <p>{{ $t('settings.pills.p2') }}</p>
    <p>{{ $t('settings.pills.p3') }}</p>
    <h2 class="text-h3">{{ $t('settings.pills.groups') }}</h2>
    <GroupForm :edit="editGroupId" @change="editGroupId = null"></GroupForm>
    <v-table hover>
      <thead>
        <tr>
          <th>{{ $t('settings.pills.name') }}</th>
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
    <h2 class="text-h3">{{ $t('settings.pills.pills') }}</h2>
    <PillForm :edit="editPillId" @change="editPillId = null"></PillForm>
    <v-table hover>
      <thead>
        <tr>
          <th>{{ $t('settings.pills.name') }}</th>
          <th>{{ $t('settings.pills.group') }}</th>
          <th>{{ $t('settings.pills.ingredients') }}</th>
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
