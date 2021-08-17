<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 text-center primary--text">
        <h5>Próximas teleconsultas</h5>
      </div>
    </div>
    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-xs-12">
        <q-inner-loading :showing="loading" class="column items-center justify-center">
          <q-spinner color="primary" size="40px" />
        </q-inner-loading>
      </div>
    </div>
    <div v-if="!loading && filteredTeleconsultations.length == 0" class="row q-col-gutter-md">
      <div class="col-xs-12 text-center primary--text">
        <h6>Você não tem nenhuma teleconsulta agendada.</h6>
      </div>
    </div>
    <div v-else-if="!loading" class="row q-mx-sm">
      <div
        v-for="(teleconsultation, i) in filteredTeleconsultations"
        :key="`teleconsultation-${i}`"
        class="col-xs-12 q-mb-md justify-start"
      >
        <div class="row justify-center">
          <div class="col-xs-8">
            <!-- <q-input
              label-color="white"
              bg-color="primary"
              label="Especialidade"
              class="text--white teleconsultation-input q-mb-sm"
              filled
              readonly
              dense
              v-model="teleconsultation.specialty"
            /> -->
            <q-input
              label-color="white"
              label="Profissional"
              bg-color="primary"
              class="text--white teleconsultation-input q-mb-sm"
              filled
              dense
              readonly
              v-model="teleconsultation.Schedule.ScheduleUsers[1].User.fullName"
            />
            <div class="row justify-between">
              <div class="col-xs-6">
                <q-input
                  label-color="white"
                  bg-color="primary"
                  label="Data"
                  class="text--white teleconsultation-input q-mb-sm"
                  filled
                  readonly
                  dense
                  :value="getDate(teleconsultation.Schedule.dateHour)"
                />
              </div>
              <div class="col-xs-5">
                <q-input
                  label-color="white"
                  bg-color="primary"
                  label="Horário"
                  class="text--white teleconsultation-input q-mb-sm"
                  filled
                  readonly
                  dense
                  :value="getHour(teleconsultation.Schedule.dateHour)"
                />
              </div>
            </div>
          </div>
          <div
            class="col-xs-4 q-my-2"
            style="display: flex; flex-direction: column; justify-content: space-around; align-items: center"
          >
            <q-btn
              @click="goToUpdateTeleconsultation(teleconsultation)"
              color="primary"
              label="Reagendar"
              :disable="teleconsultation.Schedule.isConfirmed"
              no-caps
              flat
              dense
            />
            <q-btn
              @click="openCancelTeleconsultationDialog(teleconsultation)"
              color="primary"
              label="Cancelar"
              :disable="teleconsultation.Schedule.isConfirmed"
              no-caps
              flat
              dense
            />
          </div>
          <div v-if="teleconsultation.Schedule.status === 'soon'" class="col-xs-12">
            <q-btn
              style="width: 100%;"
              color="primary"
              label="Acessar consulta"
              no-caps
              dense
              @click="getConferenceUrl(teleconsultation.Schedule.ScheduleUsers[1].UserId)"
            />
          </div>
          <div class="col-xs-11">
            <hr />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading" class="row">
      <div class="col-xs-12">
        <q-btn
          @click="goToScheduleTeleconsultation()"
          color="primary"
          label="Agendar nova teleconsulta"
          no-caps
          dense
          style="width: 100%;"
        />
      </div>
    </div>

    <q-dialog
      v-model="cancelTeleconsultationDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Você realmente deseja cancelar essa teleconsulta?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ selectedToCancel.professional }} - {{ selectedToCancel.date }} às
          {{ selectedToCancel.hour }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Não" v-close-popup />
          <q-btn flat label="Sim" @click="cancelTeleconsultation(selectedToCancel.id)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment';

export default {
  components: {},

  data() {
    return {
      search: '',
      loading: true,
      cancelTeleconsultationDialog: false,
      teleconsultations: [],
      selectedToCancel: {
        professional: null,
        date: null,
        hour: null,
      },
    };
  },

  mounted() {
    moment.locale('pt-br');
    this.$root.$emit('internalPage', false);
    this.$root.$emit('changeTitle', 'Teleconsulta');

    this.getTeleconsultations();
  },

  computed: {
    selectedSchedule: {
      get() {
        return this.$store.state.schedule.selectedSchedule;
      },
      set(val) {
        this.$store.commit('schedule/setSelectedSchedule', val);
      },
    },
    filteredTeleconsultations() {
      return this.teleconsultations.filter(t => t.Schedule.status !== 'canceled');
    },
  },

  methods: {
    async getTeleconsultations() {
      const { result } = await this.$store.dispatch('schedule/getUserSchedules', {
        type: 'teleconsulta',
      });
      this.teleconsultations = result;
      this.loading = false;
    },
    goToScheduleTeleconsultation() {
      this.$router.push('/app/client/nova-teleconsulta');
    },
    goToUpdateTeleconsultation(teleconsultation) {
      this.selectedSchedule = {
        id: teleconsultation.ScheduleId,
        professional: teleconsultation.Schedule.ScheduleUsers[1].User.fullName,
        date: this.parseDateToHtml(this.getDate(teleconsultation.Schedule.dateHour)),
        hour: this.getHour(teleconsultation.Schedule.dateHour),
      };
      this.$router.push('/app/client/editar-teleconsulta');
    },
    openCancelTeleconsultationDialog(teleconsultation) {
      this.selectedToCancel = {
        id: teleconsultation.ScheduleId,
        professional: teleconsultation.Schedule.ScheduleUsers[1].User.fullName,
        date: this.getDate(teleconsultation.Schedule.dateHour),
        hour: this.getHour(teleconsultation.Schedule.dateHour),
      };
      this.cancelTeleconsultationDialog = true;
    },
    async cancelTeleconsultation(id) {
      this.$q.loading.show();
      await this.$store.dispatch('schedule/cancelSchedule', id);
      this.$q.loading.hide();
      this.cancelTeleconsultationDialog = false;
      this.$q.notify({
        message: 'Sua teleconsulta foi cancelada com sucesso',
        color: 'positive',
      });
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
    async getConferenceUrl(professionalId) {
      this.$q.loading.show();
      try {
        const conferenceUrlResponse = await this.$store.dispatch(
          'professionals/getProfessionalConferenceUrl',
          professionalId,
        );
        if (!conferenceUrlResponse || !conferenceUrlResponse.url) {
          this.$q.notify({
            message: 'Erro ao abrir a teleconsulta, converse com o profissional no Chat',
            color: 'negative',
          });
        } else {
          window.open(conferenceUrlResponse.url, 'Consulta Arvorah', 'width=500,height=400');
        }
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao abrir a teleconsulta, converse com o profissional no Chat',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>

<style lang="sass">
.title
  font-size: 1.3em;

.title-destaque
  color: $primary
  font-weight: 600;

.teleconsultation-input > .q-field__inner > .q-field__control
  border-radius: 5px !important

.teleconsultation-input input
  color: white
  font-weight: bolder
</style>
