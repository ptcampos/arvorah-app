<template>
  <q-page padding class="bg">
    <!-- <q-btn
      icon="eva-arrow-ios-back-outline"
      size="16px"
      @click="$router.push({ path: '/login', query: { type: 'client' } })"
      :ripple="false"
      flat
    /> -->
    <q-form @submit="submit">
      <div class="row q-col-gutter-md q-pl-lg q-pr-lg">
        <div class="offset-md-4 col-md-4">
          <div class="row">
            <img src="~/assets/logo_horizontal.png" style="width: 70%;" alt="" />
          </div>
        </div>
        <div class="offset-sm-4 col-sm-4 col-xs-12">
          <div class="title">
            Login {{ accountTypeFormatted }}
            <div class="title-destaque">Preencha os campos abaixo para iniciar</div>
          </div>
        </div>
        <div class="offset-sm-4 col-sm-4 col-xs-12 q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="email"
                label="E-mail"
                v-model="user.email"
                outlined
              />
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="password"
                label="Senha"
                v-model="user.password"
                outlined
              />
              <q-btn
                @click="$router.push('/forgot-password')"
                label="Esqueceu a senha?"
                flat
                class="q-mt-sm float-right"
                dense
                no-caps
              />
            </div>
            <div class="col-xs-12">
              <q-btn
                type="submit"
                size="lg"
                label="Entrar"
                class="full-width"
                no-caps
                color="secondary"
              />
              <p class="text-center q-mt-sm">
                Ainda não tem conta?
                <q-btn
                  @click="goToTypeRegister"
                  style="margin-top: -2px"
                  color="primary"
                  label="Registrar"
                  no-caps
                  flat
                  dense
                />
              </p>
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
      user: {
        email: '',
        password: '',
      },
    };
  },

  mounted() {
    const { query } = this.$route;

    if (!query || !query.type) {
      this.$router.push({ path: 'login', query: { type: 'client' } });
    }
  },

  methods: {
    async submit() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch('user/authenticate', {
          accountType: this.accountType,
          ...this.user,
        });
        this.$router.push('/app');
      } catch (error) {
        this.$q.notify({
          title: 'Erro',
          color: 'negative',
          message: 'Login ou senha incorretos',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    goToTypeRegister() {
      if (this.accountType === 'professional') {
        return this.$router.push({ path: '/signup-professional', query: { type: 'professional' } });
      }
      return this.$router.push({ path: '/signup', query: { type: 'client' } });
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
