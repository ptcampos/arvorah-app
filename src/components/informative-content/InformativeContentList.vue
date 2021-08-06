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
