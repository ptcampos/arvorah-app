<template>
  <div class="row q-mb-md q-col-gutter-sm">
    <div class="col-12">
      <div class="text-body text-bold">
        {{ formattedEventType(formattedEvent.Schedule.type) }} -
        <q-badge :color="getEventStatusColor(formattedEvent.Schedule.status)">{{
          getEventStatusDescription(formattedEvent.Schedule.status)
        }}</q-badge>
      </div>
    </div>
    <div class="col-xs-12 col-sm-3 col-md-3">
      <TextInput
        :label="getLabel(formattedEvent.Schedule)"
        :value="getValue(formattedEvent.Schedule)"
        :blocked="true"
        additionalClasses="text--white teleconsultation-input q-mb-sm"
        label-color="white"
        bg-color="primary"
        filled
        dense
      />
    </div>
    <div class="col-xs-6 col-sm-3 col-md-3">
      <TextInput
        label="Data"
        :value="formattedDate(formattedEvent.Schedule.dateHour)"
        :blocked="true"
        additionalClasses="text--white teleconsultation-input q-mb-sm"
        label-color="white"
        bg-color="primary"
        filled
        dense
      />
    </div>
    <div class="col-xs-6 col-sm-3 col-md-3">
      <TextInput
        label="Hora"
        :value="formattedHour(formattedEvent.Schedule.dateHour)"
        :blocked="true"
        additionalClasses="text--white teleconsultation-input q-mb-sm"
        label-color="white"
        bg-color="primary"
        filled
        dense
      />
    </div>
    <div class="col-xs-12 col-sm-3 col-md-3">
      <div class="row items-center justify-center" style="height: 100%;">
        <q-btn
          @click="$router.push(`/app/client/agenda/edit/${formattedEvent.id}`)"
          color="primary"
          no-caps
          icon="eva-edit"
          outline
          :disable="!isAbbleToChangeEvent(formattedEvent.Schedule.status)"
          size="sm"
        />
        <q-btn
          @click="confirmRemoveEvent(formattedEvent)"
          color="negative"
          class="q-ml-sm"
          no-caps
          icon="eva-trash"
          outline
          :disable="!isAbbleToChangeEvent(formattedEvent.Schedule.status)"
          size="sm"
        />
        <q-btn
          @click="openVideoConference(formattedEvent)"
          color="purple"
          class="q-ml-sm"
          no-caps
          icon="eva-video-outline"
          outline
          v-show="
            formattedEvent.Schedule.type === 'teleconsulta' &&
              isAbbleToAccessTeleconsult(formattedEvent.Schedule.status)
          "
          size="sm"
        />
      </div>
    </div>

    <q-dialog v-model="confirm" persistent @hide="scheduleToRemoveId = null">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="eva-trash" color="negative" text-color="white" />
          <span class="q-ml-sm">Quer mesmo cancelar o evento?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn flat label="Sim, remover" color="negative" @click="cancelSelectedEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { formattedEventType, formattedDate, formattedHour } from 'boot/utils';
import TextInput from 'components/TextInput';

export default {
  props: ['event'],

  data() {
    return {
      confirm: false,
      scheduleToRemoveId: null,
    };
  },

  components: {
    TextInput,
  },

  methods: {
    formattedEventType,
    formattedDate,
    formattedHour,
    isAbbleToChangeEvent(status) {
      return ['pending'].includes(status);
    },
    isAbbleToAccessTeleconsult(status) {
      return ['soon'].includes(status);
    },
    async openVideoConference(formattedEvent) {
      const professional = formattedEvent.Schedule.ScheduleUsers.find(
        user => user.User.roles === 'professional',
      );
      if (!professional) {
        return this.$q.notify({
          message: 'Erro ao abrir a teleconsulta, converse com o profissional no Chat',
          color: 'negative',
        });
      }
      this.$q.loading.show();
      try {
        const conferenceUrlResponse = await this.$store.dispatch(
          'professionals/getProfessionalConferenceUrl',
          professional.userId,
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
      return 1;
    },
    getEventStatusDescription(status) {
      switch (status) {
        case 'pending':
          return 'Pendente';
        case 'canceled':
          return 'Cancelado';
        case 'occurred':
          return 'Já ocorreu';
        case 'soon':
          return 'Em Breve';
        default:
          return status;
      }
    },
    getEventStatusColor(status) {
      switch (status) {
        case 'pending':
          return 'primary';
        case 'canceled':
          return 'negative';
        case 'occurred':
          return 'positive';
        case 'soon':
          return 'purple';
        default:
          return 'black';
      }
    },
    confirmRemoveEvent(schedule) {
      this.scheduleToRemoveId = schedule.Schedule.id;
      this.confirm = true;
    },
    async cancelSelectedEvent() {
      this.$q.loading.show();
      try {
        await this.$axios.put(`/schedule/cancel/${this.scheduleToRemoveId}`);
        this.$q.notify({
          message: 'O evento foi cancelado',
          color: 'positive',
        });
        this.$emit('canceledEvent');
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao cancelar o evento',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
        this.confirm = false;
        this.scheduleToRemoveId = null;
      }
    },
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
    getProfessionalName(schedule) {
      const professional = schedule.ScheduleUsers.find(user => user.User.roles === 'professional');
      return professional ? professional.User.fullName : 'Profissional Selecionado';
    },
    getValue(schedule) {
      switch (schedule.type) {
        case 'teleconsulta':
          // get professional user
          return this.getProfessionalName(schedule);
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

<style lang="sass">
.teleconsultation-input > .q-field__inner > .q-field__control
  border-radius: 5px !important

.teleconsultation-input input
  color: white
  font-weight: bolder
</style>
