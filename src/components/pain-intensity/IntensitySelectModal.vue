<template>
  <q-dialog
    v-model="show"
    :maximized="false"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-primary" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h5 text-center">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pb-lg">
        <div class="row items-center q-col-gutter-md text-center">
          <div class="col">
            <q-btn icon="eva-minus-outline" @click="$emit('downIntensity')" round />
          </div>
          <div class="col">
            <q-btn flat :label="intensity" :ripple="false" />
          </div>
          <div class="col">
            <q-btn icon="eva-plus-outline" @click="$emit('upIntensity')" round />
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="q-pa-none q-mt-md">
        <q-btn
          label="Confirmar"
          no-caps
          class="full-width no-border-radius"
          size="18px"
          color="primary"
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    intensity: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {};
  },
};
</script>
