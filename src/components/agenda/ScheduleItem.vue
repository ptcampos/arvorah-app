<template>
  <div class="row q-mb-md q-col-gutter-sm">
    <div class="col-12">
      <div class="text-body text-bold">{{ formattedEventType(formattedEvent.Schedule.type) }}</div>
    </div>
    <div class="col-4">
      <TextInput
        :label="getLabel(formattedEvent.Schedule)"
        :value="getValue(formattedEvent.Schedule)"
        :blocked="true"
      />
    </div>
    <div class="col-4">
      <TextInput
        label="Data"
        :value="formattedDate(formattedEvent.Schedule.dateHour)"
        :blocked="true"
      />
    </div>
    <div class="col-4">
      <TextInput
        label="Hora"
        :value="formattedHour(formattedEvent.Schedule.dateHour)"
        :blocked="true"
      />
    </div>
  </div>
</template>

<script>
import { formattedEventType, formattedDate, formattedHour } from 'boot/utils';
import TextInput from 'components/TextInput';

export default {
  props: ['event'],

  components: {
    TextInput,
  },

  methods: {
    formattedEventType,
    formattedDate,
    formattedHour,
    getLabel(schedule) {
      switch (schedule.type) {
        case 'teleconsulta':
          return 'Profissional';
        case 'exame':
          return 'Nome do Exame';
        case 'outra-atividade':
          return 'Atividade';
        default:
          return schedule.type;
      }
    },
    getValue(schedule) {
      switch (schedule.type) {
        case 'teleconsulta':
          return schedule.ScheduleUsers[0].User.fullName;
        case 'exame':
          return schedule.examName;
        case 'outra-atividade':
          return schedule.description;
        default:
          return 'Outra Atividade';
      }
    },
  },

  computed: {
    formattedEvent() {
      return this.event || {};
    },
  },
};
</script>

<style></style>
