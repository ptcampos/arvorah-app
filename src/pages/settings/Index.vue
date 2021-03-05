<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="q-pa-sm q-pl-md text-h6">Alterar Senha</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="newPasswordForm" @submit="saveNewPassword">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12">
              <TextInput
                label="Senha atual"
                type="password"
                v-model="updatePassword.current"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <TextInput
                label="Nova senha"
                type="password"
                v-model="updatePassword.newPassword"
                :required="true"
              />
            </div>
            <div class="col-xs-12">
              <TextInput
                label="Confirmar nova senha"
                type="password"
                v-model="updatePassword.confirmNewPassword"
                :required="true"
                :aditionalRules="[val => !!checkIfPasswordsMatch(val) || 'Senhas não conferem']"
              />
            </div>
            <div class="col-xs-12">
              <q-btn type="submit" label="Salvar" color="primary" class="full-width" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import TextInput from 'components/TextInput';

export default {
  components: {
    TextInput,
  },
  data() {
    return {
      updatePassword: {
        current: '',
        newPassword: '',
        confirmNewPassword: '',
      },
    };
  },
  methods: {
    checkIfPasswordsMatch(val) {
      return val === this.updatePassword.newPassword;
    },
    async saveNewPassword() {
      this.$q.loading.show();
      try {
        if (!this.updatePassword.current || !this.updatePassword.newPassword) {
          this.$q.notify({
            color: 'negative',
            message: 'Todos os campos são obrigatórios',
          });
        }

        // save new password
        await this.$store.dispatch('user/updatePassword', {
          ...this.updatePassword,
        });

        this.updatePassword.current = '';
        this.updatePassword.newPassword = '';
        this.updatePassword.confirmNewPassword = '';

        this.$q.notify({
          message: 'Senha alterada com sucesso',
          color: 'positive',
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao atualizar a senha',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>

<style></style>
