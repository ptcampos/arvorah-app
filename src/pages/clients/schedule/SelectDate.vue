<template>
  <q-page padding></q-page>
</template>

<script>
export default {
  props: {
    professionalId: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.$root.$emit('internalPage', true);
    this.$root.$emit('changeTitle', 'Selecione uma Data');
  },
};
</script>

<style></style>
