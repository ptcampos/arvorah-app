<template>
  <q-page>
    <q-form>
      <q-card>
        <q-card-section>
          <div class="q-pa-sm q-pl-md text-h6">Atualizar compromisso</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <SelectInput
                v-if="schedule.Schedule"
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
                v-model="schedule.Schedule.type"
                @change="clearOthers"
              />
            </div>
            <div class="col-12">
              <ScheduleTeleconsult
                :schedule="schedule"
                v-if="schedule.Schedule.type === 'teleconsulta'"
              />
              <ScheduleExam :schedule="schedule" v-if="schedule.Schedule.type === 'exame'" />
              <ScheduleActivity
                :schedule="schedule"
                v-if="schedule.Schedule.type === 'outra-atividade'"
              />
            </div>
          </div>
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
        const { result } = await this.$store.dispatch('schedule/getUserSchedules');

        const schedule = result.find(s => parseInt(s.id, 10) === parseInt(this.id, 10));
        this.schedule = schedule;
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
