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
          Precisa de ajuda para organizar sua rotina?
        </div>
        <div class="q-mt-lg text-second-primary text-bold">
          Tenha o acompanhamento pessoal de um navegador para te auxiliar durante sua jornada
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
          Quer se manter informado?
        </div>
        <div class="q-mt-lg text-second-primary text-bold">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates numquam maiores.
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
          Lorem ipsum dolor sit amet?
        </div>
        <div class="q-mt-lg text-second-primary text-bold">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates numquam maiores.
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
