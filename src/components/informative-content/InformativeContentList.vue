<template>
  <div class="row q-col-gutter-md">
    <q-virtual-scroll class="q-pb-md" :items="contents" virtual-scroll-horizontal>
      <template v-slot="{ item, index }">
        <InformativeContentItem
          :key="index"
          :content="item"
          @onClick="$emit('onClickItem', item)"
        />
      </template>
    </q-virtual-scroll>
    <!-- <div :key="content.id" v-for="content in contents" class="col-xs-12 col-sm-6">

    </div> -->
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
