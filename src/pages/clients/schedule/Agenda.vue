<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="col-xs-12 text-center primary--text">
          <h5>Próximos Compromissos</h5>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <ScheduleItem
          :event="scheduleEvent"
          :key="scheduleEvent.id"
          v-for="scheduleEvent in scheduledEvents"
          @canceledEvent="updateEventsList"
        />
        <q-banner class="bg-grey-5 text-black" v-show="!scheduledEvents || !scheduledEvents.length">
          Você ainda não agendou nenhum compromisso
        </q-banner>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-btn
          @click="$router.push('/app/client/agenda/new')"
          color="primary"
          class="full-width"
          label="Agendar novo compromisso"
          no-caps
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ScheduleItem from 'components/agenda/ScheduleItem';

export default {
  components: {
    ScheduleItem,
  },

  data() {
    return {
      scheduledEvents: [],
    };
  },

  async mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.$q.loading.show();
      try {
        this.scheduledEvents = await this.$axios
          .get('schedule/user-schedules')
          .then(r => r.data)
          .then(r => r.result);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar os seus compromissos',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    updateEventsList() {
      this.init();
    },
  },
};
</script>

<style></style>
