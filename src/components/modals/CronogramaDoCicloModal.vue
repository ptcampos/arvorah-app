<template>
  <q-dialog
    v-model="show"
    :maximized="maximized"
    persistent
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card class="text-primary">
      <q-card-section>
        <div class="text-h6">
          Veja como será o cronograma do seu ciclo:
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list>
          <div :key="event.id" v-for="event in cycleCronogram">
            <q-item>
              <q-item-section>
                <q-item-label>{{ event.title }}</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                  :inner-html.prop="event.content | truncate(62, ' ')"
                />
              </q-item-section>

              <q-item-section side>
                <q-item-label>{{ event.date | date('DD/MM/YYYY') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset />
          </div>
        </q-list>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col-xs-12">
            <q-btn class="full-width" label="Fechar" color="primary" @click="hideModal" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Platform } from 'quasar';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      maximized: Platform.is.mobile,
      currentCycle: {},
      cycleCronogram: [],
    };
  },

  mounted() {
    this.refreshCycleCronogram();

    this.$root.$on('refreshCycleCronogram', () => {
      this.refreshCycleCronogram();
    });
  },

  methods: {
    async refreshCycleCronogram() {
      this.$q.loading.show();
      try {
        const currentUserCycle = await this.$store.dispatch('cycle/getUserCycle');
        this.currentCycle = currentUserCycle;
        if (currentUserCycle) {
          // get cronograma do ciculo
          const cycleCronogram = await this.$store.dispatch(
            'cycle/getCycleCronogram',
            currentUserCycle.id,
          );
          this.cycleCronogram = cycleCronogram;
        }
      } catch (error) {
        // console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar o cronograma do ciclo',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    hideModal() {
      this.$root.$emit('hideModal', 'cronogramaDoCiclo');
    },
  },

  computed: {},
};
</script>

<style></style>
