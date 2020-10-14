<template>
  <q-page padding class="bg">
    <q-btn icon="eva-arrow-ios-back-outline" size="16px" @click="goBack" :ripple="false" flat />
    <q-form @submit="submit">
      <div class="row q-mt-lg q-pl-lg q-pr-lg q-pt-lg">
        <div class="offset-sm-4 col-sm-4 col-xs-12">
          <div class="title">
            Cadastro Paciente
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
                outlined
                v-model="user.email"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="password"
                label="Senha"
                outlined
                v-model="user.password"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[
                  val => !!val || 'Campo Obrigatório',
                  val => senhasIguais(val) || 'Senhas não conferem',
                ]"
                hide-bottom-space
                bg-color="grey-2"
                type="password"
                label="Confirmar Senha"
                outlined
                v-model="user.confirmPassword"
              />
            </div>
            <div class="col-xs-12">
              <q-btn
                type="submit"
                size="lg"
                label="Cadastrar"
                class="full-width"
                no-caps
                color="secondary"
              />
              <p class="text-center q-mt-sm">
                Ao se cadastrar você aceita com os nossos
                <q-btn
                  @click="openExternalURL('http://google.com')"
                  style="margin-top: -2px"
                  color="primary"
                  label="Termos e Condições"
                  no-caps
                  flat
                  dense
                />
              </p>
              <p class="text-center q-mt-sm">
                Já tem conta?
                <q-btn
                  @click="$router.push({ path: '/login', query: { type: 'client' } })"
                  style="margin-top: -2px"
                  color="primary"
                  label="Entrar"
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
import { openExternalURL } from 'boot/utils';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },

  mounted() {},

  methods: {
    openExternalURL,
    goBack() {
      window.history.back();
    },
    senhasIguais(val) {
      return this.user.password === val;
    },
    async submit() {
      this.$q.loading.show();
      try {
        await this.$store.dispatch('user/signup', {
          accountType: 'client',
          ...this.user,
        });
        this.$q.notify({
          message: 'Sua conta foi criada com sucesso',
          color: 'positive',
        });
        await this.$store.dispatch('user/authenticate', {
          accountType: 'client',
          email: this.user.email,
          password: this.user.password,
        });
        this.$router.push('/app');
        // this.$router.push({ path: '/login', query: { type: 'client' } });
      } catch (error) {
        let message = 'Erro ao criar a sua Conta';
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.result &&
          error.response.data.result.message
        ) {
          message = error.response.data.result.message;
        }
        this.$q.notify({
          title: 'Erro',
          color: 'negative',
          message,
        });
      } finally {
        this.$q.loading.hide();
      }
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
