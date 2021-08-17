<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12">
      <TextInput label="Nome do Exame" :required="true" v-model="scheduleObj.examName" />
    </div>
    <div class="col-6">
      <q-input filled v-model="scheduleObj.date" type="date" mask="##/##/####" label="Data" />
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
        @click="saveSchedule()"
        color="primary"
        label="Atualizar compromisso"
        no-caps
        style="width: 100%; margin-top: 5px;"
      />
    </div>
  </div>
</template>

<script>
import TextInput from 'components/TextInput';
import moment from 'moment';

export default {
  props: ['schedule'],

  components: {
    TextInput,
  },
  mounted() {
    moment.locale('pt-br');
  },
  data() {
    return {
      scheduleObj: {
        id: this.schedule.id ? this.schedule.ScheduleId : undefined,
        examName: this.schedule.id ? this.schedule.Schedule.examName : '',
        date: this.schedule.id
          ? this.parseDateToHtml(this.getDate(this.schedule.Schedule.dateHour))
          : moment().format('YYYY-MM-DD'),
        hour: this.schedule.id ? this.getHour(this.schedule.Schedule.dateHour) : '',
      },
    };
  },
  methods: {
    async saveSchedule() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch(
          this.scheduleObj.id ? 'schedule/updateSchedule' : 'schedule/postDirectSchedule',
          {
            type: 'exame',
            id: this.scheduleObj.id,
            examName: this.scheduleObj.examName,
            hour: this.scheduleObj.hour,
            date: this.getDate(this.scheduleObj.date),
          },
        );
        this.$q.notify({
          message: `Seu exame foi ${this.scheduleObj.id ? 'reagendado' : 'criado'} com sucesso`,
          color: 'positive',
        });
        setTimeout(() => {
          this.$router.push('/app/client/agenda');
        }, 1500);
      } catch (error) {
        this.$q.notify({
          message: `Erro ao ${this.scheduleObj.id ? 'reagendar' : 'criar'} exame`,
          color: 'negative',
        });
      }
      this.$q.loading.hide();
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
  },
};
</script>

<style></style>
