<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12">
        <h5>Teleconsulta</h5>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      search: '',
      loading: false,
    };
  },

  mounted() {
    this.$root.$emit('internalPage', false);
    this.$root.$emit('changeTitle', 'Teleconsulta');
  },

  methods: {},
};
</script>

<style lang="sass" scoped>
.title
  font-size: 1.3em;

.title-destaque
  color: $primary
  font-weight: 600;
</style>
