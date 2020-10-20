<template>
  <q-page padding>
    <div class="row q-pa-sm q-col-gutter-sm">
      <div class="col-xs-12">
        <!-- <ProfessionalItem :professional="professional" /> -->
      </div>
      <div class="col-xs-12">
        <div class="text-body text-justify" v-html="informativeContent.content" />
        <!-- <q-date minimal flat class="full-width" v-model="date" :options="dateOptions" /> -->
        <q-separator class="q-mb-sm" />
      </div>
      <div class="col-xs-12">
        <label class="text-bold"
          >Em uma escala de 0 a 10, o quanto você recomendaria esse conteúdo a um amigo ou colega?
          <div class="q-mt-lg">
            <q-slider
              v-model="nps.intensity"
              :min="0"
              :max="10"
              :step="1"
              label
              label-always
              :color="nps.intensity <= 5 ? 'red' : 'green'"
            />
          </div>
        </label>
      </div>
      <div class="col-xs-12 q-pb-lg q-pt-md">
        <q-btn
          @click="saveRating"
          label="Salvar Avaliação"
          no-caps
          color="primary"
          class="full-width"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
// import ProfessionalItem from 'components/professionals/ProfessionalItem';
// import { goBack } from 'boot/utils';

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
        intensity: 10,
      },
      date: '',
      dateOptions: ['2020/09/01', '2020/09/05', '2020/09/06', '2020/09/09', '2020/09/23'],
    };
  },

  async mounted() {
    setTimeout(async () => {
      if (!this.informativeContent) {
        return this.$router.push('/app/client/informative-content');
      }
      this.$root.$emit('internalPage', true);
      this.$root.$emit('changeTitle', this.informativeContent.title);

      // save openedAt and opened
      if (!this.informativeContent.opened) {
        this.$store.dispatch('cycle/saveInformativeContentOpenedDate', this.informativeContentId);
      }
      this.nps.intensity = this.informativeContent.rating || 10;
      return 1;
    }, 1);
  },

  methods: {
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

<style></style>
