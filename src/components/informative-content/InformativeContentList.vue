<template>
  <div class="row q-col-gutter-md">
    <div :key="content.id" v-for="content in contents" class="col-xs-12 col-sm-6">
      <InformativeContentItem :content="content" @onClick="$emit('onClickItem', content)" />
    </div>
  </div>
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
