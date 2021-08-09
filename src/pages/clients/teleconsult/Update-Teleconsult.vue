<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 text-center primary--text">
        <h5>Reagendar teleconsulta</h5>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 text-center primary--text">
        <q-input filled disable v-model="selectedSchedule.professional" label="Profissional" />
      </div>
      <div class="col-xs-6 text-center primary--text">
        <q-input
          filled
          v-model="selectedSchedule.date"
          type="date"
          :min="minDate()"
          mask="##/##/####"
          label="Data"
        />
      </div>
      <div class="col-xs-6 text-center primary--text">
        <q-input
          filled
          v-model="selectedSchedule.hour"
          mask="time"
          :rules="['time']"
          label="Horário"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="selectedSchedule.hour">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="col-xs-6 text-center primary--text">
      <q-btn
        @click="saveTeleconsultation()"
        color="primary"
        label="Reagendar"
        no-caps
        dense
        style="width: 100%;"
      />
    </div>
  </q-page>
</template>

<script>
import moment from 'moment';

export default {
  computed: {
    selectedSchedule: {
      get() {
        return this.$store.state.schedule.selectedSchedule;
      },
      set(val) {
        this.$store.commit('schedule/setSelectedSchedule', val);
      },
    },
  },
  methods: {
    async saveTeleconsultation() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch('schedule/updateSchedule', {
          id: this.selectedSchedule.id,
          hour: this.selectedSchedule.hour,
          date: this.getDate(this.selectedSchedule.date),
        });
        this.$q.notify({
          message: 'Sua teleconsulta foi reagendada com sucesso',
          color: 'positive',
        });
        setTimeout(() => {
          this.$router.push('/app/client/teleconsulta');
        }, 1500);
      } catch (error) {
        this.$q.notify({
          message: 'Erro ao reagendar teleconsulta',
          color: 'negative',
        });
      }
      this.$q.loading.hide();
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    minDate() {
      moment.locale('pt-br');
      return moment()
        .add(1, 'days')
        .format('YYYY-MM-DD');
    },
  },
};
</script>

<style lang="sass" scoped></style>
