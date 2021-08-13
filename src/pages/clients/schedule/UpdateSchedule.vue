<template>
  <q-page>
    <q-form @submit="doSchedule">
      <q-card>
        <q-card-section>
          <div class="q-pa-sm q-pl-md text-h6">Atualizar um compromisso</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <SelectInput
                label="Tipo de Compromisso"
                :options="[
                  {
                    label: 'Teleconsulta',
                    value: 'teleconsulta',
                  },
                  {
                    label: 'Exame',
                    value: 'exame',
                  },
                  {
                    label: 'Outra Atividade',
                    value: 'outra-atividade',
                  },
                ]"
                v-model="schedule.type"
                @change="clearOthers"
              />
            </div>
            <div class="col-12">
              <ScheduleTeleconsult :schedule="schedule" v-if="schedule.type === 'teleconsulta'" />
              <ScheduleExam :schedule="schedule" v-if="schedule.type === 'exame'" />
              <ScheduleActivity :schedule="schedule" v-if="schedule.type === 'outra-atividade'" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row justify-center">
          <q-btn type="submit" color="primary" label="Atualizar novo compromisso" no-caps />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>
import SelectInput from 'components/SelectInput';
import ScheduleTeleconsult from 'components/agenda/ScheduleTeleconsult';
import ScheduleExam from 'components/agenda/ScheduleExam';
import ScheduleActivity from 'components/agenda/ScheduleActivity';

const defaultScheduleObj = {
  type: 'teleconsulta',
  professionalId: '',
};

export default {
  props: ['id'],

  components: {
    SelectInput,
    ScheduleTeleconsult,
    ScheduleExam,
    ScheduleActivity,
  },

  data() {
    return {
      schedule: JSON.parse(JSON.stringify(defaultScheduleObj)),
    };
  },

  async mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.$q.loading.show();
      try {
        const userSchedules = await this.$axios
          .get('schedule/user-schedules')
          .then(r => r.data)
          .then(r => r.result);
        const schedule = userSchedules.find(s => parseInt(s.id, 10) === parseInt(this.id, 10));
        // this.schedule = {
        //   ...schedule,
        // };
        console.log(schedule);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar os dados do evento',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    clearOthers(newType) {
      this.schedule = JSON.parse(JSON.stringify({ ...defaultScheduleObj, type: newType }));
    },

    async doSchedule() {
      this.$q.loading.show();
      try {
        await this.$axios.post('/schedule/direct-schedule', {
          type: this.schedule.type,
          professionalId: this.schedule.professionalId,
          date: this.schedule.date,
          hour: this.schedule.hour,
          description: this.schedule.description,
          examName: this.schedule.examName,
        });
        this.$q.notify({
          message: 'Seu compromisso foi agendado com sucesso',
          color: 'positive',
        });
        this.$router.push('/app/client/agenda');
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao agendar o seu compromisso',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>

<style></style>
