<template>
  <q-dialog v-model="show" :maximized="maximized" persistent>
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="primary"
      navigation
      padding
      height="100vh"
      class="shadow-1 text-center"
    >
      <q-carousel-slide name="page1" class="column no-wrap flex-center">
        <q-icon color="secondary" name="eva-briefcase" size="10em" />
        <div class="q-mt-lg text-secondary text-h4 text-bold">
          Você já pensou em ter um melhor controle da saúde e uma jornada oncológica com mais
          leveza?
        </div>
        <div class="row" style="margin-top: 60px;">
          <div class="col-xs-12">
            <q-btn
              type="button"
              color="primary"
              label="Próximo"
              no-caps
              size="18px"
              style="padding: 5px 60px"
              @click="slide = 'page2'"
            />
          </div>
          <div class="col-xs-12">
            <q-btn
              type="button"
              label="Pular"
              color="primary"
              no-caps
              flat
              size="18px"
              style="padding: 5px 60px"
              @click="hideModal"
            />
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="page2" class="column no-wrap flex-center">
        <q-icon color="secondary" name="eva-share" size="10em" />
        <div class="q-mt-lg text-secondary text-h4 text-bold">
          Intervenções na saúde com práticas integrativas como atividade física, suporte nutricional
          e psicossocial podem ajudar a superar os desafios!
        </div>
        <div class="row" style="margin-top: 60px;">
          <div class="col-xs-12">
            <q-btn
              type="button"
              color="primary"
              label="Próximo"
              no-caps
              size="18px"
              style="padding: 5px 60px"
              @click="slide = 'page3'"
            />
          </div>
          <div class="col-xs-12">
            <q-btn
              type="button"
              label="Pular"
              color="primary"
              no-caps
              flat
              size="18px"
              style="padding: 5px 60px"
              @click="hideModal"
            />
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="page3" class="column no-wrap flex-center">
        <q-icon color="secondary" name="eva-file-text" size="10em" />
        <div class="q-mt-lg text-secondary text-h4 text-bold">
          Nós da ARVORAH podemos te ajudar a ser protagonista do seu próprio cuidado! Vamos lá?
        </div>
        <div class="row" style="margin-top: 60px;">
          <div class="col-xs-12">
            <q-btn
              type="button"
              color="primary"
              label="Começar"
              no-caps
              size="18px"
              style="padding: 5px 60px"
              @click="hideModal"
            />
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
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
      slide: 'page1',
    };
  },

  mounted() {},

  methods: {
    hideModal() {
      localStorage.setItem('showModal', '0');
      this.$root.$emit('hideOnboardingModal');
    },
  },

  computed: {},
};
</script>

<style></style>
