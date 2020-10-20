<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- <div class="col-xs-12">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6"><q-icon :name="ionNewspaperOutline" /> Últimas Notícias</div>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <NewsCarousel />
          </q-card-section>
        </q-card>
      </div> -->

      <div class="col-xs-12">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6"><q-icon :name="ionCalendarOutline" /> Ciclo Atual</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <q-list>
                  <q-item tag="label">
                    <q-item-section>
                      <q-item-label>Início:</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ currentCycle.startDate | date('DD/MM/YYYY') }}
                    </q-item-section>
                  </q-item>
                  <q-item tag="label">
                    <q-item-section>
                      <q-item-label>Fim:</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ currentCycle.endDate | date('DD/MM/YYYY') }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <q-btn
                  icon="eva-clipboard-outline"
                  color="primary"
                  class="full-width"
                  label="Conteúdo Informativo"
                  @click="$router.push({ path: '/app/client/informative-content' })"
                />
                <q-btn
                  icon="eva-calendar"
                  flat
                  color="primary"
                  class="q-mt-sm full-width"
                  label="Cronograma"
                  @click="$root.$emit('showModal', 'cronogramaDoCiclo')"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// import NewsCarousel from 'components/news/NewsCarousel';
import {
  ionNewspaperOutline,
  ionCalendarOutline,
  ionBookmarksOutline,
  ionNotificationsOutline,
} from '@quasar/extras/ionicons-v5';

export default {
  name: 'PageClientHome',

  components: {
    // NewsCarousel,
  },

  data() {
    return {
      ionNewspaperOutline,
      ionCalendarOutline,
      ionBookmarksOutline,
      ionNotificationsOutline,
      currentCycle: {},
    };
  },

  mounted() {
    this.$root.$emit('internalPage', false);
    this.$root.$emit('changeTitle');
    // get current user cycle. if any, show modal
    this.init();

    this.$root.$on('refreshClientCurrentCycle', () => {
      this.refreshCurrentCycle();
    });
  },

  methods: {
    showPrincipaisDoresModal() {
      setTimeout(() => {
        this.$root.$emit('showModal', 'principaisDores');
      }, 100);
    },
    async refreshCurrentCycle() {
      this.$q.loading.show();
      try {
        const currentUserCycle = await this.$store.dispatch('cycle/getUserCycle');
        if (!currentUserCycle || !currentUserCycle.active) {
          this.showPrincipaisDoresModal();
        } else {
          this.currentCycle = currentUserCycle;
        }
      } catch (error) {
        let errorReason = '';
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.result &&
          error.response.data.result.error
        ) {
          errorReason = error.response.data.result.error;
        }
        this.$q.notify({
          message: `Erro ao recuperar as informações do ciclo ${errorReason}`,
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async init() {
      this.refreshCurrentCycle();
    },
  },
};
</script>
