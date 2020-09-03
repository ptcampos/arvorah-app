<template>
  <q-item
    @click="$emit('onClick', professional)"
    class="item shadow-1 q-mb-sm rounded-bg q-pt-md"
    clickable
    v-ripple
  >
    <q-item-section avatar>
      <q-avatar rounded>
        <img :src="professional.avatar" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ professional.name }}</q-item-label>
      <q-item-label caption lines="1">{{ professional.healthAreaDescription }}</q-item-label>
      <q-item-label caption lines="1">
        <q-icon color="blue" :name="ionLocationOutline" />
        {{ professional.city }}
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-icon name="star" color="yellow" />
      <q-item-label caption>{{ professional.rating | currency('') }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { ionLocationOutline } from '@quasar/extras/ionicons-v5';

export default {
  props: {
    professional: {
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
