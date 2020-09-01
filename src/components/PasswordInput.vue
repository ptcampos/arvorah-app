<template>
  <q-input
    type="password"
    :label="label"
    :dense="dense"
    :value="value"
    :placeholder="placeholder"
    outlined
    v-on:input="updateValue($event)"
    :ref="referencia"
    hide-bottom-space
    :rules="[val => !!checkRequired(val) || 'Campo obrigatório', ...aditionalRules]"
    bg-color="grey-2"
  />
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    referencia: {
      type: String,
      required: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    aditionalRules: {
      type: Array,
      default: () => [],
      required: false,
    },
  },

  methods: {
    updateValue($event) {
      this.$emit('input', $event);
    },
    checkRequired(val) {
      if (!this.required) {
        return true;
      }
      if (this.required && !val) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style></style>
