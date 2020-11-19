<template>
  <q-card
    @click="$emit('onClick', content)"
    class="q-mb-md shadow-1"
    clickable
    v-ripple
    :disable="!content.released"
  >
    <div
      class="l-pain-identifier"
      :style="{
        'background-color': getPainBackgroundColor(
          content.InformativeModuleCyclePain.CyclePain.pain,
        ),
      }"
    />
    <img
      :src="
        cmsContent._embedded && cmsContent._embedded['wp:featuredmedia']
          ? cmsContent._embedded['wp:featuredmedia']['0'].source_url
          : 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
      "
    />

    <q-card-section>
      <div class="text-h6">{{ cmsContent.title.rendered }}</div>
      <div class="text-subtitle2">
        <q-badge :color="content.released ? 'green' : 'orange'">{{
          content.released ? 'Disponível' : 'Em breve'
        }}</q-badge>
      </div>
      <div class="text-body" v-html="cmsContent.excerpt.rendered" />
    </q-card-section>

    <q-separator />

    <q-card-section v-show="content.released">
      <q-btn class="full-width" label="Leia Mais" no-caps flat color="primary" />
    </q-card-section>

    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="50px" />
    </q-inner-loading>
  </q-card>
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
        this.content.informativeContentCMSId,
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
    getPainBackgroundColor(pain) {
      return painColor(pain);
    },
  },
};
</script>

<style scoped>
.l-pain-identifier {
  width: 90%;
  position: absolute;
  top: -15px;
  left: calc(50% - 45%);
  height: 15px;
  margin: 0 auto;
  border-radius: 20px 20px 0 0;
}

.content-img {
  /* height: 200px; */
}
</style>
