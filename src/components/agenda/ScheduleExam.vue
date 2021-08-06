<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12">
      <TextInput label="Nome do Exame" :required="true" v-model="schedule.examName" />
    </div>
    <div class="col-6">
      <TextInput label="Data" mask="##/##/####" :required="true" v-model="schedule.date" />
    </div>
    <div class="col-6">
      <TextInput label="Hora" mask="##:##" :required="true" v-model="schedule.hour" />
    </div>
  </div>
</template>

<script>
import TextInput from 'components/TextInput';

export default {
  props: ['schedule'],

  components: {
    TextInput,
  },
};
</script>

<style></style>
