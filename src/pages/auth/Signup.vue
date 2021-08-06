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
      <div class="row q-col-gutter-md q-pl-lg q-pr-lg">
        <div class="offset-md-4 col-md-4">
          <div class="row login-image">
            <img src="~/assets/logo_vertical.png" style="width: 70%;" alt="" />
          </div>
        </div>
        <div class="offset-md-4 col-md-4 col-xs-12">
          <div class="title text-center white--text text-weight-bold">
            Cadastro
            <div class="title-destaque white--text text-weight-bold">
              Preencha os campos abaixo para iniciar
            </div>
          </div>
        </div>
        <div class="offset-md-4 col-md-4 col-xs-12 q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="text"
                label="Nome"
                outlined
                v-model="user.firstName"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="text"
                label="Sobrenome"
                outlined
                v-model="user.lastName"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="text"
                label="Data de Nascimento"
                outlined
                v-model="user.birthDate"
                mask="##/##/####"
              />
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[val => !!val || 'Campo Obrigatório']"
                hide-bottom-space
                bg-color="grey-2"
                type="text"
                label="Celular"
                outlined
                v-model="user.phone"
                mask="(##) #####-####"
              />
            </div>
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
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                outlined
                v-model="user.password"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-xs-12">
              <q-input
                :rules="[
                  val => !!val || 'Campo Obrigatório',
                  val => senhasIguais(val) || 'Senhas não conferem',
                ]"
                hide-bottom-space
                bg-color="grey-2"
                :type="showPassword ? 'text' : 'password'"
                label="Confirmar Senha"
                outlined
                v-model="user.confirmPassword"
              />
            </div>
            <div class="col-xs-12">
              <q-btn
                type="submit"
                size="md"
                label="Cadastrar"
                class="full-width"
                no-caps
                color="primary"
              />
              <p class="text-center q-mt-md white--text">
                Ao se cadastrar você aceita os nossos
                <!-- @Todo - Change this url above -->
                <q-btn
                  @click="openExternalURL('http://google.com')"
                  style="margin-top: -2px; text-decoration: underline"
                  label="Termos e Condições"
                  no-caps
                  flat
                  dense
                />
              </p>
              <p class="text-center q-mt-md white--text">
                Já possui cadastro?
                <q-btn
                  @click="$router.push('/login')"
                  style="margin-top: -2px; text-decoration: underline"
                  label="Clique Aqui"
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
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
      showPassword: false,
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
  font-weight: 400;

.bg
  background-image: linear-gradient(180deg, rgba(213,213,213, .6) 0%, rgba(4,146,149, .7) 100%), url(~assets/tree.jpg)
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
