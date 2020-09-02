<template>
  <q-page padding class="bg">
    <div class="row q-pl-lg q-pr-lg q-pt-sm">
      <div class="offset-sm-4 col-sm-4 col-xs-12">
        <div class="title">
          <div class="title-destaque">
            Para marcar suas consultas escolha um dos planos disponíveis
          </div>
        </div>
      </div>
      <div class="text-center q-pt-lg">
        <!-- <img class="img" src="~assets/video-chamada.png" alt="" /> -->
        <div class="row q-col-gutter-md">
          <div class="col-xs-12">
            <q-btn
              no-caps
              color="grey-1"
              rounded
              style="border: #ddd 2px solid; padding: 15px 30px;"
              @click="selecPlan(3)"
            >
              <div class="row">
                <div class="text-h6 text-black">
                  <q-icon color="black" name="eva-calendar-outline" class="q-mr-sm" />3 meses
                </div>
              </div>
            </q-btn>
          </div>
          <div class="col-xs-12">
            <q-btn
              no-caps
              color="grey-1"
              rounded
              style="border: #ddd 2px solid; padding: 15px 30px;"
              @click="selecPlan(6)"
            >
              <div class="row">
                <div class="text-h6 text-black">
                  <q-icon color="black" name="eva-calendar-outline" class="q-mr-sm" />6 meses
                </div>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  components: {},

  data() {
    return {};
  },

  methods: {
    selecPlan(type) {
      this.$router.push(`/plan-subscription/select/${type}`);
    },
  },

  computed: {},
};
</script>

<style lang="sass" scoped>
.img
  max-width: 100%;

.title
  font-size: 1.7em;

.title-destaque
  font-size: 18px;
  color: $primary
  font-weight: 400;

.bg
  padding-top: 30px;
  background: url(~assets/bg-welcome.png)  no-repeat center center fixed
  background-position: 0 120px;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
</style>
