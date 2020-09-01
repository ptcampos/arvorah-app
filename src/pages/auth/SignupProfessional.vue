<template>
  <q-page padding class="bg">
    <q-btn icon="eva-arrow-ios-back-outline" size="16px" @click="goBack" :ripple="false" flat />
    <q-form @submit="submit">
      <div class="row q-pl-lg q-pr-lg q-pt-sm">
        <div class="offset-sm-4 col-sm-4 col-xs-12">
          <div class="title">
            Cadastro de Profissional
            <div class="title-destaque">Preencha os campos abaixo para iniciar</div>
          </div>
        </div>
        <div class="offset-sm-4 col-sm-4 col-xs-12 q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-xs-6">
              <TextInput v-model="user.firstName" label="Nome" :required="true" />
            </div>
            <div class="col-xs-6">
              <TextInput v-model="user.lastName" label="Sobrenome" :required="true" />
            </div>
            <div class="col-xs-12">
              <TextInput v-model="professional.nickname" label="Como quer ser chamado?" />
            </div>
            <div class="col-xs-12">
              <EmailInput v-model="user.email" label="E-mail" :required="true" />
            </div>
            <div class="col-xs-12">
              <DateInput
                v-model="professional.birthDate"
                label="Data de Nascimento"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <SelectInput
                v-model="professional.gender"
                label="Sexo"
                :options="[
                  { label: 'Masculino', value: 'masculino' },
                  { label: 'Feminino', value: 'feminino' },
                ]"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <TextInput
                v-model="professional.cpf"
                label="CPF"
                type="tel"
                mask="###.###.###-##"
                :required="true"
                :aditionalRules="[val => !!documentoValido(val) || 'Documento inválido']"
              />
            </div>
            <div class="col-xs-12">
              <SelectInput
                v-model="professional.civilState"
                label="Estado Civil"
                :options="[
                  { label: 'Solteiro(a)', value: 'solteiro' },
                  { label: 'Casado(a)', value: 'casado' },
                  { label: 'Divorciado(a)', value: 'divorciado' },
                  { label: 'Separado(a)', value: 'separado' },
                  { label: 'Viúvo(a)', value: 'viuvo' },
                ]"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <SelectInput
                v-model="professional.healthArea"
                label="Área de Saúde"
                :options="[
                  { label: 'Educação Física', value: 'atividade-fisica' },
                  { label: 'Psicologia', value: 'psicologia' },
                  { label: 'Nutrição', value: 'nutricao' },
                ]"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <TextInput
                v-model="professional.phone"
                label="Telefone"
                type="tel"
                mask="(##) #####-####"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <TextInput
                v-model="professional.zip"
                label="CEP"
                type="tel"
                mask="#####-###"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <TextInput v-model="professional.address" label="Endereço" :required="true" />
            </div>
            <div class="col-xs-8">
              <TextInput v-model="professional.city" label="Cidade" :required="true" />
            </div>
            <div class="col-xs-4">
              <TextInput v-model="professional.state" label="UF" mask="AA" :required="true" />
            </div>
            <div class="col-xs-12">
              <PasswordInput v-model="user.password" label="Senha" :required="true" />
            </div>
            <div class="col-xs-12">
              <PasswordInput
                v-model="user.confirmPassword"
                label="Confirmar Senha"
                :required="true"
                :aditionalRules="[val => senhasIguais(val) || 'Senhas não conferem']"
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
                Já tem conta?
                <q-btn
                  @click="$router.push({ path: '/login', query: { type: 'professional' } })"
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
import TextInput from 'components/TextInput';
import SelectInput from 'components/SelectInput';
import DateInput from 'components/DateInput';
import EmailInput from 'components/EmailInput';
import PasswordInput from 'components/PasswordInput';

import { isDocumentoValidoByTipoPessoa } from 'boot/utils';

export default {
  components: {
    TextInput,
    SelectInput,
    DateInput,
    EmailInput,
    PasswordInput,
  },

  data() {
    return {
      user: {
        email: '',
        password: '',
        confirmPassword: '',
      },
      professional: {
        nickname: '',
        birthDate: '',
        gender: '',
        cpf: '',
        civilState: '',
        healthArea: '',
        phone: '',
        zip: '',
        address: '',
        addressNumber: '',
        addressComplement: '',
        city: '',
        state: '',
      },
    };
  },

  methods: {
    goBack() {
      window.history.back();
    },
    documentoValido(val) {
      return isDocumentoValidoByTipoPessoa(val, 'pessoa-fisica');
    },
    senhasIguais(val) {
      return this.user.password === val;
    },
    async submit() {
      this.$q.loading.show();
      try {
        const response = await this.$store.dispatch('user/signup', {
          ...this.user,
          accountType: 'professional',
        });
        await this.$store.dispatch('user/createProfessional', {
          ...this.professional,
          userId: response.result.id,
        });
        this.$q.notify({
          message: 'Sua conta foi criada com sucesso',
          color: 'positive',
        });
        await this.$store.dispatch('user/authenticate', {
          accountType: 'professional',
          email: this.user.email,
          password: this.user.password,
        });
        this.$router.push('/app');
        // this.$router.push({ path: '/login', query: { type: 'professional' } });
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
