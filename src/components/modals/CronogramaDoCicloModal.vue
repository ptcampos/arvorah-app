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
        <div class="q-mt-sm row q-col-gutter-md"></div>
        <div class="row q-mt-lg">
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
    };
  },

  methods: {
    hideModal() {
      this.$root.$emit('hideModal', 'cronogramaDoCiclo');
    },
  },

  computed: {},
};
</script>

<style></style>
