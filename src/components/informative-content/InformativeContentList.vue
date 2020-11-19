<template>
  <transition-group
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    appear
    :duration="300"
  >
    <InformativeContentItem
      :content="content"
      :key="content.id"
      v-for="(content, index) in contents"
      @onClick="$emit('onClickItem', content)"
      :style="{
        'margin-top': index === 0 ? '15px' : '35px',
      }"
    />
  </transition-group>
</template>

<script>
import InformativeContentItem from './InformativeContentItem';

export default {
  props: {
    contents: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    InformativeContentItem,
  },
};
</script>

<style lang="sass" scoped></style>
