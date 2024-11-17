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
      {{ $t('home.time_modal.title') }}
    </template>
    <template #append>
      <v-icon icon="mdi-close" @click="show = false"></v-icon>
    </template>
    <v-card-text>
      <p>{{ $t('home.time_modal.not_clicking') }}</p>
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
          <v-btn block color="primary" @click="setTime">{{ $t('home.time_modal.set_time') }}</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    </v-card>
  </v-dialog>
</template>
