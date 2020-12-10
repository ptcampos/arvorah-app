<template>
  <div class="relative-position" v-if="show">
    <q-card
      class="wrapper text-primary intensity-select-card"
      style="width: 700px; max-width: 90vw;"
      :style="{
        top: getTopDistance(),
      }"
    >
      <q-card-section>
        <div class="text-h5 text-center">{{ title }}</div>
        <q-btn
          outline
          no-caps
          color="pink"
          icon="info"
          label="Saiba Mais"
          class="q-mt-sm full-width"
          @click="fetchAndShowMoreDetailsAboutPain"
        />
      </q-card-section>

      <q-card-section class="q-pb-lg">
        <q-slider
          :value="intensity"
          :min="0"
          :max="10"
          :step="1"
          label
          label-always
          color="primary"
          @change="val => $emit('manualChangeIntensity', val)"
        />
        <div class="row items-center q-col-gutter-md text-center">
          <div class="col">
            <q-btn icon="eva-minus-outline" @click="$emit('downIntensity')" round />
          </div>
          <div class="col">
            <q-btn flat size="36px" :label="intensity" :ripple="false" />
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
          @click="$emit('confirm')"
          :style="{
            color: 'white',
            background: getOptionColor(pain),
          }"
        />
      </q-card-actions>
    </q-card>

    <MoreDetailsAboutPain
      :show="showMoreDetailsAboutPain"
      :moreDetails="moreDetails"
      @close="() => onCloseMoreDetails()"
    />
  </div>
</template>

<script>
import _ from 'lodash';

import { painColor } from 'boot/utils';

import MoreDetailsAboutPain from 'components/informative-content/MoreDetailsAboutPain';

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
    order: {
      type: Number,
      default: 1,
    },
    pain: {
      type: String,
      default: '',
    },
  },

  components: {
    MoreDetailsAboutPain,
  },

  data() {
    return {
      showMoreDetailsAboutPain: false,
      moreDetails: {
        title: '',
        value: '',
        content: '',
      },
    };
  },

  methods: {
    getTopDistance() {
      if (this.order === 1) {
        return '10px';
      }
      if (this.order === 2) {
        return '60px';
      }
      if (this.order === 3) {
        return '115px';
      }
      return '150px';
    },
    onCloseMoreDetails() {
      this.showMoreDetailsAboutPain = false;
      this.moreDetails.title = '';
      this.moreDetails.value = '';
      this.moreDetails.content = '';
    },
    async fetchAndShowMoreDetailsAboutPain() {
      this.$q.loading.show();
      try {
        const category = await this.$store.dispatch(
          'informativeContent/getCategoryBySlug',
          _.kebabCase(this.title),
        );
        if (category && category.length) {
          this.showMoreDetailsAboutPain = true;
          this.moreDetails.title = this.title;
          this.moreDetails.value = this.value;
          this.moreDetails.content = _.head(category).description;
          return;
        }
        this.$q.notify({
          message: 'Categoria não encontrada',
          color: 'negative',
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar mais detalhes',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    getOptionColor(pain) {
      return painColor(pain);
    },
  },
};
</script>

<style scoped>
.intensity-select-card {
  position: relative;
  left: -50%;
}

.wrapper {
  position: absolute;
  left: 0;
}
</style>
