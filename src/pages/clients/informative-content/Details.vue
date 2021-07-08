<template>
  <q-page padding>
    <div class="row">
      <div class="offset-sm-3 col-sm-6 col-xs-12">
        <img
          style="width: 100%;"
          :src="
            cmsContent._embedded && cmsContent._embedded['wp:featuredmedia']
              ? cmsContent._embedded['wp:featuredmedia']['0'].source_url
              : 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
          "
        />
      </div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" />
    <div class="row q-pa-sm q-col-gutter-sm">
      <div class="offset-sm-3 col-sm-6 col-xs-12" id="informative-content">
        <div class="text-body text-justify" v-html="cmsContent.content.rendered" />
        <!-- <q-date minimal flat class="full-width" v-model="date" :options="dateOptions" /> -->
        <q-separator class="q-mb-sm" />
      </div>
    </div>

    <q-dialog full-width v-model="ratingDialog" :position="'bottom'">
      <q-card class="bg-grey-3">
        <q-card-section class="row items-center">
          <div>
            <div class="text-weight-bold">Avalie o Conteúdo</div>
            <div class="text-body">O que achou do conteúdo?</div>
          </div>
        </q-card-section>

        <q-card-section class="row justify-center items-center">
          <q-rating v-model="nps.intensity" size="3.5em" color="orange-5" />
          <q-btn
            class="q-mt-md full-width"
            type="button"
            @click="saveRating"
            label="Avaliar Conteúdo"
            no-caps
            color="primary"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-scroll-observer @scroll="onScroll" />
  </q-page>
</template>

<script>
// import ProfessionalItem from 'components/professionals/ProfessionalItem';
import { openExternalURL } from 'boot/utils';
import { dom } from 'quasar';

// Offset on screen
const { offset } = dom;

export default {
  props: {
    informativeContentId: {
      type: String,
      required: true,
    },
  },

  components: {},

  data() {
    return {
      professional: {},
      nps: {
        intensity: 5,
      },
      cmsContent: {
        title: {},
        excerpt: {},
        content: {},
      },
      date: '',
      dateOptions: ['2020/09/01', '2020/09/05', '2020/09/06', '2020/09/09', '2020/09/23'],
      ratingDialog: false,
      scrollInfo: {},
      showedRating: false,
      alreadyAnsweredRating: true,
    };
  },

  async mounted() {
    setTimeout(async () => {
      if (!this.informativeContent) {
        return this.$router.push('/app/client/informative-content');
      }
      this.$root.$emit('internalPage', true);

      // carregar dados completos do conteudo
      this.$q.loading.show();
      try {
        // console.log(this.informativeContent);
        const conteudoCompleto = await this.$store.dispatch(
          'informativeContent/getContentById',
          this.informativeContent.id,
        );
        // console.log(conteudoCompleto);
        // console.log(conteudoCompleto);
        this.cmsContent = conteudoCompleto;
        this.$root.$emit('changeTitle', this.cmsContent.title.rendered);
      } catch (error) {
        console.log(error);
        // this.$q.notify({
        //   message: 'Não foi possível carregar os detalhes do conteúdo',
        //   color: 'negative',
        // });
        return this.$router.push('/app/client/home');
      } finally {
        this.$q.loading.hide();
      }

      // save openedAt and opened
      if (!this.informativeContent.opened) {
        // this.$store.dispatch('cycle/saveInformativeContentOpenedDate', this.informativeContentId);
      }
      if (this.informativeContent.rating) {
        this.alreadyAnsweredRating = true;
      } else {
        this.alreadyAnsweredRating = false;
      }
      this.nps.intensity = this.informativeContent.rating || 5;

      const myElementToCheckIfClicksAreInsideOf = document.querySelector('#informative-content');
      document.body.addEventListener('click', event => {
        if (
          myElementToCheckIfClicksAreInsideOf &&
          myElementToCheckIfClicksAreInsideOf.contains(event.target) &&
          event.target.tagName.toLowerCase() === 'a'
        ) {
          event.preventDefault();
          openExternalURL(event.target.href);
        }
      });

      return 1;
    }, 1);
  },

  methods: {
    onScroll(info) {
      const offsetContent = offset(document.getElementById('informative-content'));
      if (offsetContent.top > 270 && this.showedRating) {
        this.showedRating = false;
      }
      this.scrollInfo = info;
      // if (
      //   info.direction === 'down' &&
      //   offsetContent.top < 80 &&
      //   !this.ratingDialog &&
      //   !this.showedRating &&
      //   !this.alreadyAnsweredRating
      // ) {
      //   this.ratingDialog = true;
      //   this.showedRating = true;
      // }
    },
    async saveRating() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch('cycle/saveInformativeContentRating', {
          ...this.nps,
          informativeContentId: this.informativeContentId,
        });
        this.$q.notify({
          message: 'Obrigado! O seu feedback é muito importante para nós',
          color: 'positive',
        });
        this.alreadyAnsweredRating = true;
        this.ratingDialog = false;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao salvar o rating',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },

  computed: {
    informativeContent() {
      return this.$store.getters['cycle/currentInformativeContent'];
    },
  },
};
</script>

<style>
iframe {
  width: 100% !important;
}
</style>
