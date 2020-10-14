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

          <q-card-section class="q-pa-none">
            <NewsCarousel />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import NewsCarousel from 'components/news/NewsCarousel';
import {
  ionNewspaperOutline,
  ionCalendarOutline,
  ionBookmarksOutline,
  ionNotificationsOutline,
} from '@quasar/extras/ionicons-v5';

export default {
  name: 'PageClientHome',

  components: {
    NewsCarousel,
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
    this.$root.$emit('changeTitle');
    // get current user cycle. if any, show modal
    this.init();
  },

  methods: {
    showPrincipaisDoresModal() {
      setTimeout(() => {
        this.$root.$emit('showModal', 'principaisDores');
      }, 100);
    },
    async init() {
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
  },
};
</script>
