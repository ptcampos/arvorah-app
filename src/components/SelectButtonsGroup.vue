<template>
  <div class="row q-col-gutter-sm">
    <div class="col" :key="index" v-for="(option, index) in options">
      <q-btn
        :color="option.selected ? 'teal' : 'teal-1'"
        :text-color="option.selected ? 'white' : 'black'"
        style="padding: 10px 0; width: 100%; min-height: 120px;"
        no-caps
        @click="$emit('onClick', { option, index })"
      >
        <div class="column items-center">
          <div class="bg-white text-black rounded-bg q-pa-sm q-mb-sm">
            <q-icon :name="option.icon" />
          </div>
          <div class="text-caption">{{ option.label }}</div>
        </div>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style></style>
