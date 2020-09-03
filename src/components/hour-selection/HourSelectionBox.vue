<template>
  <div class="box">
    <div
      class="title"
      :style="{
        background:
          `linear-gradient(to right, ${colorFrom || 'black'} , ${colorTo || 'grey'})` || 'black',
        color: textColor || 'black',
      }"
    >
      {{ period }}
    </div>
    <div class="row items-center">
      <div class="q-pr-sm" :key="index" v-for="(hour, index) in availableHours">
        <q-btn
          :label="hour.description"
          :color="hour.selected ? 'primary' : 'white'"
          :text-color="hour.selected ? 'white' : 'black'"
          dense
          :flat="!hour.selected"
          @click="$emit('hourSelected', hour)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    period: {
      type: String,
      required: true,
    },
    colorFrom: {
      type: String,
      required: false,
    },
    colorTo: {
      type: String,
      required: false,
    },
    textColor: {
      type: String,
      required: false,
    },
    availableHours: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="sass" scoped>
.box
  border: solid 1px #ccc
  border-radius: 8px
  position: relative
  padding: 20px 20px

.title
  position: absolute
  top: -10px
  left: 15px
  border-radius: 10px
  padding: 1px 15px
  font-size: .8em
</style>
