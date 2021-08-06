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
          <div class="row login-image">
            <img src="~/assets/logo_vertical.png" style="width: 70%;" alt="" />
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
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                v-model="user.password"
                outlined
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
              <q-btn
                @click="$router.push('/forgot-password')"
                label="Esqueci a minha senha"
                flat
                class="q-mt-sm float-left white--text"
                dense
                no-caps
              />
            </div>
            <div class="col-xs-12">
              <q-btn
                type="submit"
                size="md"
                label="Entrar"
                class="full-width"
                no-caps
                color="primary"
              />
            </div>
            <div class="col-xs-12 q-mt-md text-center">
              <p class="q-mt-sm white--text">
                <q-btn
                  @click="goToTypeRegister"
                  style="margin-top: -2px"
                  color="white"
                  label="Criar uma conta"
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
      showPassword: false,
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
  background-image: linear-gradient(180deg, rgba(213,233,233, .6) 0%, rgba(4,146,149, .8) 100%), url(~assets/tree.jpg)
  background-position: center center
  background-repeat: no-repeat

.login-image
  display: flex
  justify-content: center
  align-items: center
  padding: 10px
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, .8) 30%, rgba(255, 255, 255, .5) 50%, rgba(255, 255, 255, .4) 60%, rgba(255, 255, 255, 0) 70%) no-repeat center center;
  background-size: 250px 250px
  height: 250px;

.login-image img
  width: 50% !important
</style>
