<template>
  <q-input
    :label="label"
    :dense="dense"
    :value="value"
    :placeholder="placeholder"
    :mask="mask ? mask : ''"
    type="email"
    outlined
    v-on:input="updateValue($event)"
    :ref="referencia"
    hide-bottom-space
    :rules="[val => !!checkRequired(val) || 'Campo obrigatório']"
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
    mask: {
      type: String,
      required: false,
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
