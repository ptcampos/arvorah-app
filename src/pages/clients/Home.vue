<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6"><q-icon :name="ionNewspaperOutline" /> Notícias</div>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <NewsCarousel />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12">
        <q-btn
          style="padding: 10px 10px"
          outline
          align="left"
          no-caps
          class="full-width"
          color="teal"
          to="/app/client/schedule-select-professional"
        >
          <q-icon left size="3em" :name="ionCalendarOutline" />
          <div>Agendar Consulta</div>
        </q-btn>
      </div>
      <div class="col-xs-12">
        <q-btn
          style="padding: 10px 10px"
          outline
          align="left"
          no-caps
          class="full-width"
          color="cyan"
        >
          <q-icon left size="3em" :name="ionBookmarksOutline" />
          <div>Compromissos</div>
        </q-btn>
      </div>
      <div class="col-xs-12">
        <q-btn
          style="padding: 10px 10px"
          outline
          align="left"
          no-caps
          class="full-width"
          color="secondary"
        >
          <q-icon left size="3em" :name="ionNotificationsOutline" />
          <div>Notificações</div>
        </q-btn>
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
    };
  },

  mounted() {
    this.$root.$emit('changeTitle');
  },
};
</script>
