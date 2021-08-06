<template>
  <q-page padding class="bg">
    <q-btn
      class="q-ma-sm shadow-1"
      icon="eva-arrow-ios-back-outline"
      size="16px"
      @click="goBack"
      :ripple="false"
      fab-mini
      color="primary"
    />
    <q-form @submit="submit">
      <div class="row q-mt-lg q-pl-lg q-pr-lg q-pt-lg">
        <div class="offset-sm-4 col-sm-4 col-xs-12">
          <div class="title text-center white--text text-weight-bold">
            Esqueceu a senha?
            <div class="title-destaque text-center white--text">
              Não se preocupe, coloque o seu e-mail abaixo que iremos recuperá-la
            </div>
          </div>
        </div>
        <div class="offset-sm-4 col-sm-4 col-xs-12 q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                bg-color="grey-2"
                type="email"
                label="E-mail"
                outlined
                hide-bottom-space
                v-model="email"
              />
            </div>
            <div class="col-xs-12">
              <q-btn
                type="submit"
                size="md"
                label="Resetar Senha"
                class="full-width"
                no-caps
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async submit() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch('user/recoverPassword', {
          email: this.email,
          userType: 'user',
        });
        this.$q.notify({
          message: 'As instruções para recuperar a sua senha foram enviadas para o e-mail',
          color: 'positive',
        });
        this.email = '';
        this.$router.push('/login');
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao recuperar a senha, check se o e-mail está correto',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },

  computed: {
    accountType() {
      const { query } = this.$route;
      return query.type || '';
    },
    accountTypeFormatted() {
      if (!this.accountType) {
        return '';
      }
      switch (this.accountType) {
        case 'client':
          return 'Paciente';
        case 'professional':
          return 'Profissional';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.img
  max-width: 100%;

.title
  font-size: 1.7em;

.title-destaque
  font-size: 18px;
  font-weight: 400;

.bg
  background-image: linear-gradient(180deg, rgba(213,213,213, .6) 0%, rgba(4,146,149, .7) 100%), url(~assets/tree.jpg)
  background-position: center center
  background-repeat: no-repeat
</style>
