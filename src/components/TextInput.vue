<template>
  <q-input
    :label="label"
    :dense="dense"
    :value="value"
    :placeholder="placeholder"
    :mask="mask ? mask : ''"
    :type="type || 'text'"
    outlined
    v-on:input="updateValue($event)"
    :ref="referencia"
    hide-bottom-space
    :rules="[val => !!checkRequired(val) || 'Campo obrigatório', ...aditionalRules]"
    :readonly="blocked"
    :labelColor="labelColor"
    :bg-color="bgColor || 'grey-2'"
    :filled="filled"
    :class="additionalClasses"
  />
</template>

<script>
export default {
  props: {
    additionalClasses: {
      type: String,
      required: false,
    },
    labelColor: {
      type: String,
      required: false,
    },
    bgColor: {
      type: String,
      required: false,
    },
    filled: {
      type: Boolean,
      required: false,
    },
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
    value: {},
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
    aditionalRules: {
      type: Array,
      default: () => [],
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    blocked: {
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
