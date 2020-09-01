<template>
  <q-input
    :label="label"
    :dense="dense"
    :value="value"
    :placeholder="placeholder"
    stack-label
    type="text"
    outlined
    v-on:input="updateValue($event)"
    :ref="referencia"
    hide-bottom-space
    :rules="[val => !!checkRequired(val) || 'Campo obrigatório']"
    prefix="R$"
    mask="#.##"
    fill-mask="0"
    reverse-fill-mask
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
