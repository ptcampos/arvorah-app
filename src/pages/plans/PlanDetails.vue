<template>
  <q-page padding class="bg">
    <q-btn icon="eva-arrow-ios-back-outline" size="16px" @click="goBack" :ripple="false" flat />
    <div class="row q-pl-lg q-pr-lg q-pt-sm">
      <div class="offset-sm-4 col-sm-4 col-xs-12">
        <div class="title text-center bg-grey-4 rounded-bg q-pt-sm q-pb-sm plan-title">
          Pacote de {{ planType }} meses
        </div>
        <div class="bg-grey-2 rounded-bg content-body">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-list>
                <q-item-label class="text-bold text-black" header>Benefícios:</q-item-label>
                <q-item v-ripple :key="index" v-for="(benefit, index) in benefits">
                  <q-item-section avatar>
                    <q-icon color="primary" name="eva-arrow-right-outline" />
                  </q-item-section>

                  <q-item-section>{{ benefit.name }}</q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-xs-12">
              <div class="text-center">
                <div class="text-h6 text-bold">Valor: R$ X,XX</div>
              </div>
            </div>
            <div class="col-xs-12">
              <div class="text-center q-mt-sm">
                <q-btn
                  @click="subscribeToPlan"
                  label="Assinar"
                  color="primary"
                  rounded
                  style="padding: 0 40px"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { goBack } from 'boot/utils';
import * as UserService from '../../services/User';

export default {
  props: {
    planType: {
      type: String,
      required: true,
      validator: value => parseInt(value, 10) === 3 || parseInt(value, 10) === 6,
    },
  },

  components: {},

  data() {
    return {
      benefits: [
        { name: 'Benefício do Plano' },
        { name: 'Benefício do Plano' },
        { name: 'Benefício do Plano' },
        { name: 'Benefício do Plano' },
        { name: 'Benefício do Plano' },
      ],
    };
  },

  mounted() {
    const planType = parseInt(this.planType, 10);
    if (!planType || (planType !== 3 && planType !== 6)) {
      this.$q.dialog({
        title: 'Oops!',
        message: 'Plano desconhecido',
      });
      this.$router.push('/app');
    }
  },

  methods: {
    goBack,
    subscribeToPlan() {
      const plan = this.planType;
      this.$q
        .dialog({
          title: 'Confirmar Assinatura',
          message: `Você confirma que deseja assinar o plano de ${plan} meses?`,
          cancel: {
            color: 'negative',
            flat: true,
            label: 'Não, cancelar',
          },
          ok: {
            color: 'primary',
            flat: true,
            label: 'Sim, assinar',
          },
          persistent: true,
        })
        .onOk(() => {
          // go to payment gateway
          // save currentUserPlan - UserService
          UserService.setUserPlan(plan);
          // route to HOME (/app)
          this.$router.push('/app');
        });
    },
  },

  computed: {},
};
</script>

<style lang="sass" scoped>
.content-body
  padding: 12px 8px 24px
  margin-top: -1px
  border-radius: 0 0 5px 5px

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
