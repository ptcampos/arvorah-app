<template>
  <q-select
    :label="label"
    :dense="dense"
    :value="value"
    :placeholder="placeholder"
    stack-label
    outlined
    v-on:input="updateValue($event)"
    hide-bottom-space
    :options="options"
    emit-value
    map-options
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
    value: {},
    options: {
      type: Array,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    updateValue($event) {
      // console.log($event)
      this.$emit('input', $event);
      this.$emit('change', $event);
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
