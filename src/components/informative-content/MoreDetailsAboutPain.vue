<template>
  <q-dialog v-model="show" :maximized="maximized" persistent>
    <q-card class="text-primary">
      <q-card-section>
        <div class="text-h6 text-center q-mb-sm">
          {{ moreDetails.title }}
        </div>
        <q-separator />
        <div class="text-body q-mt-md text-dark" v-html="moreDetails.content" />
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn class="full-width" @click="$emit('close')" no-caps label="Voltar" color="primary" />
      </q-card-actions>
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
    moreDetails: {
      type: Object,
      default: () => {},
    },
  },

  components: {},

  data() {
    return {
      maximized: Platform.is.mobile,
    };
  },

  methods: {},

  computed: {},
};
</script>
