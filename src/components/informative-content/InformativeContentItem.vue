<template>
  <div>
    <q-card
      @click="$emit('onClick', content)"
      class="q-mb-sm shadow-5 card"
      clickable
      :disable="!content.released"
    >
      <!-- <div
        class="l-pain-identifier"
        :style="{
          'background-color': getPainBackgroundColor(
            content.InformativeModuleCyclePain.CyclePain.pain,
          ),
        }"
      /> -->
      <div class="img" :style="getBgImage(cmsContent)" />

      <q-card-section v-if="!loading" class="card-section-body">
        <div class="title" v-html="cmsContent.title.rendered"></div>
        <div class="text-body" v-html="cmsContent.excerpt.rendered" />
      </q-card-section>

      <q-separator class="q-mt-md" />

      <q-card-section class="q-pa-none">
        <div class="text-caption text-grey-8 text-center">
          <q-icon name="eva-calendar-outline" />&nbsp;{{ content.date | date('DD/MM/YYYY') }}
        </div>
      </q-card-section>

      <q-inner-loading
        :showing="loading"
        class="column items-center justify-center"
        style="height: 150px"
      >
        <q-spinner color="primary" size="40px" />
      </q-inner-loading>
    </q-card>
    <!-- <q-btn
      @click="$emit('onClick', content)"
      class="full-width"
      label="Leia Mais"
      no-caps
      flat
      color="primary"
      dense
    /> -->
  </div>
</template>

<script>
import { painColor } from 'boot/utils';
import { ionLocationOutline } from '@quasar/extras/ionicons-v5';

const defaultImg = require('../../assets/logo_horizontal.png');

export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      ionLocationOutline,
      loading: true,
      cmsContent: {
        title: {},
        excerpt: {},
      },
      placeholderImg: 'http://placehold.jp/300x300.png',
    };
  },

  async mounted() {
    // get conteudo completo do cms...
    this.loading = true;
    try {
      const conteudoCompleto = await this.$store.dispatch(
        'informativeContent/getContentById',
        this.content.id,
      );
      this.cmsContent = conteudoCompleto;
    } catch (error) {
      console.log(error);
      this.$q.notify({
        message: '',
        color: 'negative',
      });
    } finally {
      this.loading = false;
    }
  },

  methods: {
    getBgImage(cmsContent) {
      const style =
        cmsContent._embedded && cmsContent._embedded['wp:featuredmedia']
          ? { background: `url(${cmsContent._embedded['wp:featuredmedia']['0'].source_url})` }
          : {
              ...(this.loading && { background: `url(${this.placeholderImg})` }),
              ...(!this.loading && {
                background: `url(${defaultImg}) no-repeat center center`,
                backgroundSize: '75%',
              }),
            };

      return style;
    },
    getPainBackgroundColor(pain) {
      return painColor(pain);
    },
  },
};
</script>

<style lang="sass" scoped>
.l-pain-identifier
  width: 90%;
  position: absolute;
  top: -15px;
  left: calc(50% - 45%);
  height: 15px;
  margin: 0 auto;
  border-radius: 20px 20px 0 0;

.title
  color: $primary
  font-size: 14px
  margin-bottom: 3px

.card
  max-width: 200px;
  margin-right: 15px;

.img
  height: 120px;
  width: 200px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

.card-section-body
  max-height: 136px
  overflow: hidden

.text-body
  font-size: 13px
</style>
