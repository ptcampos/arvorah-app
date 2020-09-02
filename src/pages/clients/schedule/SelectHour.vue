<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12">
        <ProfessionalItem :professional="professional" />
      </div>
      <div class="col-xs-12">
        <div class="row justify-between items-center">
          <q-btn size="sm" @click="moveDate('down')" icon="eva-arrow-ios-back-outline" round />
          <div class="text-body q-pl-sm">{{ currentDate }}</div>
          <q-btn size="sm" @click="moveDate('up')" icon="eva-arrow-ios-forward-outline" round />
        </div>
      </div>
      <div class="col-xs-12">
        <q-btn
          @click="confirmSchedule"
          label="Marcar Consulta"
          no-caps
          color="primary"
          class="full-width"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment';

import ProfessionalItem from 'components/professionals/ProfessionalItem';

export default {
  props: {
    professionalId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },

  components: {
    ProfessionalItem,
  },

  data() {
    return {
      professional: {},
      selectedHour: null,
      availableHours: [],
      initialDate: this.date,
    };
  },

  mounted() {
    this.$root.$emit('internalPage', true);
    this.$root.$emit('changeTitle', 'Selecione o Horário');

    this.professional = {
      id: 1,
      name: 'Hans Down',
      rating: 4.0,
      city: 'Brasília, DF',
      healthArea: 'atividade-fisica',
      healthAreaDescription: 'Educador Físico',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    };
  },

  methods: {
    moveDate(to) {
      if (to === 'up') {
        this.initialDate = moment(this.initialDate, 'DD_MM_YYYY')
          .add(1, 'day')
          .format('DD_MM_YYYY');
        return;
      }
      this.initialDate = moment(this.initialDate, 'DD_MM_YYYY')
        .subtract(1, 'day')
        .format('DD_MM_YYYY');
    },
    confirmSchedule() {
      if (!this.selectedHour) {
        return this.$q.dialog({
          title: 'Oops!',
          message: 'Selecione um Horário',
        });
      }
      const id = 1;
      return this.$router.push(`/app/client/schedule/${id}`);
    },
  },

  computed: {
    currentDate() {
      return moment(this.initialDate, 'DD_MM_YYYY').format('dddd, DD [de] MMMM');
    },
  },
};
</script>

<style></style>
