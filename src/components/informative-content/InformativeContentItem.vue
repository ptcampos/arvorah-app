<template>
  <q-card
    @click="$emit('onClick', content)"
    class="q-mb-md shadow-1"
    clickable
    v-ripple
    :disable="!content.released"
  >
    <img src="https://cdn.quasar.dev/img/mountains.jpg" />

    <q-card-section>
      <div class="text-h6">{{ content.title }}</div>
      <div class="text-subtitle2">
        {{ content.type && content.type === 'main' ? 'Principal' : 'Pílula' }}
      </div>
      <q-item-label>
        <q-badge v-show="!content.released" color="orange">Em Breve</q-badge>
        <q-badge v-show="content.opened && content.rating === null" color="grey"
          >Visualizado - Falta Avaliar</q-badge
        >
        <q-badge v-show="content.opened && content.rating !== null" color="green">Avaliado</q-badge>
      </q-item-label>
    </q-card-section>

    <q-card-section side top>
      <!-- <q-icon name="star" color="yellow" /> -->
      <q-item-label>{{ content.date | date('DD/MM/YYYY') }}</q-item-label>
    </q-card-section>
  </q-card>
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
