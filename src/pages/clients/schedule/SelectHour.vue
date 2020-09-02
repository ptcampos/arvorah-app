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
        <HourSelectionBox
          period="Manhã"
          colorFrom="#FFFA8F"
          colorTo="#FFF394"
          :availableHours="availableHours.morning"
          @hourSelected="val => onHourSelected(val, 'morning')"
        />
      </div>
      <div class="col-xs-12">
        <HourSelectionBox
          period="Tarde"
          colorFrom="#D8C8FC"
          colorTo="#B2FDEF"
          :availableHours="availableHours.afternoon"
          @hourSelected="val => onHourSelected(val, 'afternoon')"
        />
      </div>
      <div class="col-xs-12">
        <HourSelectionBox
          period="Noite"
          colorFrom="#78E1FC"
          colorTo="#85FEF3"
          :availableHours="availableHours.night"
          @hourSelected="val => onHourSelected(val, 'night')"
        />
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
import HourSelectionBox from 'components/hour-selection/HourSelectionBox';

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
    HourSelectionBox,
  },

  data() {
    return {
      professional: {},
      selectedHour: null,
      initialDate: this.date,
      availableHours: {
        morning: [
          { description: '10:00' },
          { description: '11:00', selected: true },
          { description: '11:30' },
        ],
        afternoon: [{ description: '12:00' }, { description: '12:30' }, { description: '13:00' }],
        night: [{ description: '19:00' }, { description: '19:30' }, { description: '20:00' }],
      },
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
    clearAllHours() {
      this.availableHours.morning = this.availableHours.morning.map(h => ({
        ...h,
        selected: false,
      }));
      this.availableHours.afternoon = this.availableHours.afternoon.map(h => ({
        ...h,
        selected: false,
      }));
      this.availableHours.night = this.availableHours.night.map(h => ({
        ...h,
        selected: false,
      }));
    },
    onHourSelected(hour, period) {
      this.clearAllHours();
      this.availableHours[period] = this.availableHours[period].map(h => ({
        ...h,
        selected: hour.description === h.description,
      }));
    },
    moveDate(to) {
      this.clearAllHours();
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
