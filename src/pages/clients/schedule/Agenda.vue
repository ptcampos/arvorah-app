<template>
  <q-page>
    <DaykeepCalendar
      event-ref="MYCALENDAR"
      :prevent-event-detail="true"
      :event-array="eventsObj"
      :sunday-first-day-of-week="true"
      calendar-locale="pt-BR"
      calendar-timezone="America/Sao_Paulo"
      :allow-editing="false"
      :render-html="true"
    />
    <q-dialog v-model="showEventDetailsModal">
      <q-card class="q-pa-sm" style="min-width: 60%;">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-weight-bold">{{ eventDetailObject.summary }}</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-xs-12">
              <div class="text-body text-bold">
                {{ eventDetailObject.location }}
              </div>
              <div class="text-body">
                {{ eventDetailObject.start.dateTime | date('DD/MM/YYYY HH:mm') }}
              </div>
              <div class="text-body">
                Link da sala:
                <a :href="eventDetailObject.conferenceUrl" target="_blank">{{
                  eventDetailObject.conferenceUrl
                }}</a>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            @click.prevent="confirmCancelEvent(eventDetailObject)"
            v-close-popup
            label="Cancelar"
            color="negative"
            type="button"
          />
          <q-btn
            v-if="!eventDetailObject.Schedule.isConfirmed"
            @click.prevent="confirmConfirmEvent(eventDetailObject)"
            v-close-popup
            label="Confirmar"
            color="primary"
            type="button"
          />
          <q-space />
          <q-btn v-close-popup flat label="Fechar Janela" color="primary" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import * as moment from 'moment';
import { DaykeepCalendar } from '@daykeep/calendar-quasar';

export default {
  components: {
    DaykeepCalendar,
  },

  data() {
    return {
      eventsObj: [],
      pendingEvents: [],
      showEventDetailsModal: false,
      eventDetailObject: {
        Schedule: {},
        start: {},
      },
      eventStatusColor: {
        pending: 'orange',
        canceled: 'negative',
        occurred: 'green',
        soon: 'blue',
      },
      notif1: true,
    };
  },

  async mounted() {
    this.init();

    const self = this;

    this.$root.$on('click-event-MYCALENDAR', eventDetailObject => {
      self.eventDetailObject = { ...eventDetailObject };
      self.showEventDetailsModal = true;
    });
  },

  methods: {
    getEventStatusColor(schedule) {
      switch (schedule.status) {
        case 'pending':
          if (schedule.isConfirmed) {
            return 'blue';
          }
          return 'orange';

        case 'canceled':
          return 'negative';
        case 'occurred':
          return 'green';
        case 'soon':
          return 'pink';
        default:
          return 'grey';
      }
    },
    async init() {
      this.$q.loading.show();
      try {
        // TODO get user events
        // const userEvents = await this.$store.dispatch('cycle/getUserScheduleEvents');
        const userEvents = [];
        this.eventsObj = userEvents.map(scheduleEvent => this.getEventData(scheduleEvent));
        this.pendingEvents = userEvents
          .filter(scheduleEvent => scheduleEvent.Schedule.status === 'pending')
          .map(scheduleEvent => this.getEventData(scheduleEvent));
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar seu calendario',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    getEventData(scheduleEvent) {
      const users = scheduleEvent.Schedule.ScheduleUsers;
      const usersNames = users.map(u => u.User.firstName).join(' - ');
      console.log(users);
      // TODO: eventLength
      return {
        ...scheduleEvent,
        id: scheduleEvent.id,
        summary: `Consulta ${usersNames} - ${scheduleEvent.Schedule.status}`,
        description: `Link da conferência: ${
          scheduleEvent.Schedule.isConfirmed ? ': CONFIRMADO' : ''
        }`,
        conferenceUrl: '',
        location: 'Virtual - Video conferência',
        start: {
          dateTime: moment(scheduleEvent.Schedule.dateHour).toISOString(), // ISO 8601 formatted
        },
        end: {
          dateTime: moment(scheduleEvent.Schedule.dateHour)
            .add(30, 'minutes')
            .toISOString(),
        },
        color: this.getEventStatusColor(scheduleEvent.Schedule),
        attendees: users.map(user => ({
          id: user.User.id,
          email: user.User.email,
          displayName: user.User.firstName,
          organizer: false,
          self: false,
          resource: false,
        })),
      };
    },
    async confirmCancelEvent(event) {
      await this.$q
        .dialog({
          title: 'Confirmação',
          message: 'Quer mesmo cancelar o evento agendado?',
          ok: {
            label: 'Sim, cancelar',
            color: 'negative',
            noCaps: true,
            flat: true,
          },
          cancel: {
            label: 'Não, manter o evento',
            color: 'primary',
            noCaps: true,
            flat: true,
          },
        })
        .onOk(async () => {
          // update event status to cancelled if date is not passed
          this.$q.loading.show();
          try {
            await this.$store.dispatch('cycle/cancelSchedule', event.Schedule.id);
            this.init();
            this.$q.notify({
              message: 'O evento foi cancelado com sucesso',
              color: 'positive',
            });
          } catch (error) {
            console.log(error);
            this.$q.notify({
              message: 'Erro ao cancelar o agendamento, peça para um cancelamento manual',
              color: 'negative',
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
    async confirmConfirmEvent(event) {
      await this.$q
        .dialog({
          title: 'Confirmação',
          message: 'Quer mesmo confirmar o evento agendado?',
          ok: {
            label: 'Sim, confirmar',
            color: 'primary',
            noCaps: true,
            flat: true,
          },
          cancel: {
            label: 'Não',
            color: 'negative',
            noCaps: true,
            flat: true,
          },
        })
        .onOk(async () => {
          // update event status to cancelled if date is not passed
          this.$q.loading.show();
          try {
            await this.$store.dispatch('cycle/confirmSchedule', event.Schedule.id);
            this.init();
            this.$q.notify({
              message: 'O evento foi confirmado com sucesso',
              color: 'positive',
            });
          } catch (error) {
            console.log(error);
            this.$q.notify({
              message: 'Erro ao confirmar o agendamento',
              color: 'negative',
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
  },
};
</script>

<style></style>
