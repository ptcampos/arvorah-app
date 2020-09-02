<template>
  <q-list padding>
    <q-item-label header>{{ professionals.length }} Profissionais Encontrados</q-item-label>

    <transition-group
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      appear
      :duration="300"
    >
      <ProfessionalItem
        :professional="professional"
        :key="index"
        v-for="(professional, index) in professionals"
        @onClick="$emit('onClickItem', professional)"
      />
    </transition-group>
  </q-list>
</template>

<script>
import ProfessionalItem from './ProfessionalItem';

export default {
  props: {
    professionals: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    ProfessionalItem,
  },
};
</script>

<style lang="sass" scoped></style>
