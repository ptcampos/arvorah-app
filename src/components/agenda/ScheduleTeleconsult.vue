<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12" v-if="!scheduleObj.id">
      <q-select
        label="Especialidade"
        :loading="loading"
        filled
        v-model="selectedArea"
        :options="healthAreas"
        option-value="value"
        option-label="text"
      />
    </div>
    <div class="col-12">
      <q-select
        filled
        v-model="scheduleObj.professional"
        :disable="scheduleObj.id > 0"
        :options="professionals"
        option-value="id"
        option-label="nickname"
        label="Profissional"
      />
    </div>
    <div class="col-6">
      <q-input
        filled
        v-model="scheduleObj.date"
        type="date"
        :min="minDate()"
        mask="##/##/####"
        label="Data"
      />
    </div>
    <div class="col-6">
      <q-input filled v-model="scheduleObj.hour" mask="time" :rules="['time']" label="Horário">
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="scheduleObj.hour">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12">
      <q-btn
        @click="saveTeleconsultation()"
        color="primary"
        label="Atualizar teleconsulta"
        no-caps
        style="width: 100%; margin-top: 5px;"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: ['schedule'],

  data() {
    return {
      professionals: [],
      healthAreas: [],
      loading: true,
      selectedArea: null,
      selectedProfessional: null,
      scheduleObj: {
        id: this.schedule.id ? this.schedule.ScheduleId : undefined,
        date: this.schedule.id
          ? this.parseDateToHtml(this.getDate(this.schedule.Schedule.dateHour))
          : this.minDate(),
        hour: this.schedule.id ? this.getHour(this.schedule.Schedule.dateHour) : undefined,
        professional: this.schedule.id
          ? {
              id: this.schedule.Schedule.ScheduleUsers[1].UserId,
              nickname: this.schedule.Schedule.ScheduleUsers[1].User.fullName,
            }
          : null,
      },
    };
  },

  mounted() {
    moment.locale('pt-br');
    this.getHealthAreas();
  },

  methods: {
    async saveTeleconsultation() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch(
          this.scheduleObj.id ? 'schedule/updateSchedule' : 'schedule/postDirectSchedule',
          {
            type: 'teleconsulta',
            id: this.scheduleObj.id,
            hour: this.scheduleObj.hour,
            date: this.getDate(this.scheduleObj.date),
            professionalId: this.scheduleObj.id ? undefined : this.scheduleObj.professional.id,
          },
        );
        this.$q.notify({
          message: `Sua teleconsulta foi ${
            this.scheduleObj.id ? 'reagendada' : 'criada'
          } com sucesso`,
          color: 'positive',
        });
        setTimeout(() => {
          this.$router.push('/app/client/agenda');
        }, 1500);
      } catch (error) {
        this.$q.notify({
          message: `Erro ao ${this.scheduleObj.id ? 'reagendar' : 'criar'} teleconsulta`,
          color: 'negative',
        });
      }
      this.$q.loading.hide();
    },
    async getProfessionalsByArea() {
      this.$q.loading.show();
      const arr = [this.selectedArea];
      const result = await this.$store.dispatch('cycle/getProfessionalsBasedOnAreas', arr);
      this.professionals = result;
      this.scheduleObj.professional = null;
      this.$q.loading.hide();
    },
    async getHealthAreas() {
      const result = await this.$store.dispatch('professionals/getAreas');
      const areas = Object.entries(result).map(item => {
        return {
          value: item[0],
          text: item[1],
        };
      });
      this.healthAreas = areas;
      this.loading = false;
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    getHour(date) {
      return moment(date).format('HH:mm');
    },
    parseDateToHtml(date) {
      const dates = date.split('/');
      return dates.reverse().join('-');
    },
    minDate() {
      return moment()
        .add(1, 'days')
        .format('YYYY-MM-DD');
    },
  },

  computed: {
    formattedProfessionals() {
      const empty = [
        {
          label: 'Selecione um profissional',
          value: '',
        },
      ];
      return [
        ...empty,
        ...this.professionals.map(p => ({
          label: p.nickname,
          value: p.id,
        })),
      ];
    },
  },
  watch: {
    selectedArea() {
      this.getProfessionalsByArea();
    },
  },
};
</script>

<style></style>
