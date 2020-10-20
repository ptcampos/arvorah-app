<template>
  <q-item
    @click="$emit('onClick', content)"
    class="item shadow-1 q-mb-sm rounded-bg q-pt-md"
    clickable
    v-ripple
    :disable="!content.released"
  >
    <q-item-section>
      <q-item-label>{{ content.title }} </q-item-label>
      <q-item-label>
        <q-badge v-show="!content.released" color="orange">Em Breve</q-badge>
        <q-badge v-show="content.opened && content.rating === null" color="grey"
          >Visualizado - Falta Avaliar</q-badge
        >
        <q-badge v-show="content.opened && content.rating !== null" color="green">Avaliado</q-badge>
      </q-item-label>
      <q-item-label caption>
        Tipo: {{ content.type && content.type === 'main' ? 'Principal' : 'Pílula' }}
      </q-item-label>
      <!-- <q-item-label caption lines="2" :inner-html.prop="content.content | truncate(62, ' ')" /> -->
    </q-item-section>

    <q-item-section side top>
      <!-- <q-icon name="star" color="yellow" /> -->
      <q-item-label>{{ content.date | date('DD/MM/YYYY') }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
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
    };
  },
};
</script>

<style></style>
