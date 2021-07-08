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
      <div
        class="img"
        :style="{
          background: getBgImage(cmsContent),
        }"
      />

      <q-card-section class="card-section-body">
        <div class="title" v-html="cmsContent.title.rendered"></div>
        <!-- <div class="text-subtitle2">
          <q-badge color="green">Disponível</q-badge>
        </div> -->
        <div class="text-body" v-html="cmsContent.excerpt.rendered" />
      </q-card-section>

      <q-separator class="q-mt-md" />

      <q-card-section class="q-pa-none">
        <div class="text-caption text-grey-8 text-center">
          <q-icon name="eva-calendar-outline" />&nbsp;{{ content.date | date('DD/MM/YYYY') }}
        </div>
      </q-card-section>

      <q-inner-loading :showing="loading">
        <q-spinner color="primary" size="50px" />
      </q-inner-loading>
    </q-card>
    <q-btn
      @click="$emit('onClick', content)"
      class="full-width"
      label="Leia Mais"
      no-caps
      flat
      color="primary"
      dense
    />
  </div>
</template>

<script>
import { painColor } from 'boot/utils';
import { ionLocationOutline } from '@quasar/extras/ionicons-v5';

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
      // console.log(conteudoCompleto);
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
      const url =
        cmsContent._embedded && cmsContent._embedded['wp:featuredmedia']
          ? cmsContent._embedded['wp:featuredmedia']['0'].source_url
          : 'http://placehold.jp/300x300.png';
      return `url(${url})`;
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
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

.card-section-body
  max-height: 136px
  overflow: hidden

.text-body
  font-size: 13px
</style>
