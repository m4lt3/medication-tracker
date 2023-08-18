<script setup>
  import { ref } from 'vue';

  const emit = defineEmits([ 'timeSelected' ]);

  const show = ref(false);

  const date = ref("");
  const time = ref("");

  function setTime() {
    let moment = new Date(date.value + "T" + time.value);
    emit('timeSelected', moment.valueOf());

    show.value = false;
    
    date.value = "";
    time.value = "";
  }
</script>
<template>
  <v-dialog
    v-model="show"
    width="auto"
  >
    <template #activator="{ props }">
      <v-btn v-bind="props" size="large"><v-icon icon="mdi-clock-edit-outline"></v-icon></v-btn>
    </template>
    <v-card
      width="auto"
    >
    <template #title>
      Select a different time
    </template>
    <template #append>
      <v-icon icon="mdi-close" @click="show = false"></v-icon>
    </template>
    <v-card-text>
      <p>Not clicking on "Set time" automatticaly assumes you've taken it now</p>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            prepend-inner-icon="mdi-calendar"
            type="date"
            v-model="date"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            prepend-inner-icon="mdi-clock-outline"
            type="time"
            v-model="time"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn block color="primary" @click="setTime">Set time</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    </v-card>
  </v-dialog>
</template>
