<template>
  <q-dialog
    v-model="show"
    :maximized="maximized"
    persistent
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card class="text-primary">
      <q-card-section>
        <div class="text-h6">
          Bem vindo ao Saúde Integrativa! Para começar, pode nos informar as suas Principais Dores?
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-show="step === 'painSelect'">
        <div class="text-body text-bold">
          Selecione as suas {{ requiredAmount }} Principais Dores para trabalharmos durante o Ciclo:
        </div>
        <div class="q-mt-sm row q-col-gutter-md">
          <div class="col-sm-3 col-xs-6" :key="option.value" v-for="option in options">
            <div class="row items-center justify-center">
              <q-btn
                :outline="!option.selected"
                :label="option.label"
                stack
                color="indigo"
                @click="toggle(option)"
                style="height: 90px; width: 140px;"
              />
            </div>
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-xs-12">
            <q-btn
              :disable="blockNextButton"
              class="full-width"
              :label="buttonLabel"
              color="primary"
              @click="goToIntensity"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section v-show="step === 'intensitySelect'">
        <div class="text-body text-bold">
          Selecione as intensidades:
        </div>
        <div class="q-mt-sm row q-col-gutter-md">
          <div class="col-xs-12" :key="option.value" v-for="option in selectedPains">
            <div class="text-body text-dark">{{ option.label }}:</div>
            <div class="q-pl-md q-pr-md q-mt-lg">
              <q-slider
                v-model="option.intensity"
                :min="1"
                :max="10"
                :step="1"
                label
                label-always
                :color="option.intensity > 5 ? 'red' : 'green'"
              />
            </div>
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-xs-12">
            <q-btn
              class="full-width"
              label="Salvar"
              color="primary"
              @click="saveSelectedOptionsAndClose"
            />
            <q-btn
              class="q-mt-sm full-width"
              label="Voltar"
              color="primary"
              flat
              @click="step = 'painSelect'"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Platform } from 'quasar';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      maximized: Platform.is.mobile,
      step: 'painSelect',
      options: [
        {
          label: 'Comer Bem',
          value: 'comer_bem',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Efeitos Colaterais',
          value: 'efeitos_colaterais',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Espiritualidade',
          value: 'espiritualidade',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Lidar com Emoções',
          value: 'lidar_com_emocoes',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Me Exercitar',
          value: 'me_exercitar',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Meus Direitos',
          value: 'meus_direitos',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Sexualidade',
          value: 'sexualidade',
          icon: '',
          selected: false,
          intensity: 1,
        },
        {
          label: 'Vida após Câncer',
          value: 'vida_apos_cancer',
          icon: '',
          selected: false,
          intensity: 1,
        },
      ],
    };
  },

  methods: {
    hideModal() {
      this.$root.$emit('hideModal', 'principaisDores');
    },
    toggle(option) {
      option.selected = !option.selected;
    },
    goToIntensity() {
      this.step = 'intensitySelect';
    },
    async saveSelectedOptionsAndClose() {
      this.$q.loading.show();
      try {
        const selectedOptions = this.selectedPains;
        await this.$store.dispatch('cycle/create', { selectedOptions });
        this.$q.notify({
          message: 'Seu ciclo foi iniciado com sucesso!',
          color: 'positive',
        });
        this.hideModal();
        this.$root.$emit('showModal', 'cronogramaDoCiclo');
      } catch (error) {
        let errorReason = '';
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.result &&
          error.response.data.result.error
        ) {
          errorReason = error.response.data.result.error;
        }
        this.$q.notify({
          message: `Erro ao criar o ciclo do usuário ${errorReason}`,
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },

  computed: {
    requiredAmount() {
      return 3;
    },
    selectedPains() {
      return [...this.options].filter(o => o.selected);
    },
    amountOfSelectedOptions() {
      return this.options.filter(o => o.selected).length;
    },
    blockNextButton() {
      return this.amountOfSelectedOptions !== this.requiredAmount;
    },
    pendingAmount() {
      return this.requiredAmount - this.amountOfSelectedOptions;
    },
    buttonLabel() {
      if (this.blockNextButton && this.pendingAmount < 0) {
        return 'Selecione somente 3 dores';
      }
      if (this.blockNextButton) {
        return `Falta${this.pendingAmount > 1 ? 'm' : ''} ${this.pendingAmount} dor${
          this.pendingAmount > 1 ? 'es' : ''
        }`;
      }
      return 'Avançar';
    },
  },
};
</script>

<style></style>
