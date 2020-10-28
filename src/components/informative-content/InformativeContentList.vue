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
      v-for="content in contents"
      @onClick="$emit('onClickItem', content)"
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
