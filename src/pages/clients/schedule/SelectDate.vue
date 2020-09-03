<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <ProfessionalItem :professional="professional" />
      </div>
      <div class="col-xs-12">
        <div class="text-subtitle2 q-pl-sm">Datas Disponíveis:</div>
        <q-date minimal flat class="full-width" v-model="date" :options="dateOptions" />
      </div>
      <div class="col-xs-12">
        <q-btn
          @click="goToSelectHour"
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
  },

  components: {
    ProfessionalItem,
  },

  data() {
    return {
      professional: {},
      date: '',
      dateOptions: ['2020/09/01', '2020/09/05', '2020/09/06', '2020/09/09', '2020/09/23'],
    };
  },

  mounted() {
    this.$root.$emit('internalPage', true);
    this.$root.$emit('changeTitle', 'Selecione uma Data');

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
    goToSelectHour() {
      if (!this.date) {
        return this.$q.dialog({
          title: 'Oops!',
          message: 'Selecione uma data',
        });
      }
      const minDate = moment(this.date, 'YYYY/MM/DD').format('DD_MM_YYYY');
      return this.$router.push(
        `/app/client/schedule-select-hour/${this.professionalId}/${minDate}`,
      );
    },
  },
};
</script>

<style></style>
