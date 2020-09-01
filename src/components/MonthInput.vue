<template>
  <q-input
    :label="label"
    stack-label
    :rules="[
      val => !!checkRequired(val) || 'Campo obrigatório',
      val => !!isValidDate(val) || 'Data Inválida',
    ]"
    :mask="mask || '##/####'"
    :dense="dense"
    type="tel"
    outlined
    :value="value"
    v-on:input="updateValue($event)"
    hide-bottom-space
    :required="required"
    @change="onChange"
  />
</template>

<script>
import { isValidDate } from 'boot/utils';

export default {
  props: {
    mask: {
      type: String,
      required: false,
    },
    label: {
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
    required: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    isValidDate(val) {
      return isValidDate(val, 'MM/YYYY');
    },
    updateValue($event) {
      // console.log($event)
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
    onChange(val) {
      this.$emit('change', val);
    },
  },
};
</script>

<style></style>
