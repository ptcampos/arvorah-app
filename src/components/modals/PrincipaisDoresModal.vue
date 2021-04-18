<template>
  <q-dialog
    v-model="show"
    :maximized="maximized"
    persistent
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card class="text-primary" v-show="step === 'painSelect'">
      <q-card-section>
        <q-btn
          icon="eva-arrow-ios-back-outline"
          size="16px"
          @click="$root.$emit('hideModal', 'principaisDores')"
          label="Voltar"
          :ripple="false"
          flat
        />
        <div class="text-body text-bold text-center q-mt-md">
          Selecione para que possamos personalizar sua jornada:
        </div>
        <div class="q-mt-sm row q-col-gutter-md">
          <div class="col-sm-3 col-xs-6" :key="option.value" v-for="option in options">
            <div class="row items-center justify-center">
              <q-btn
                :outline="!option.selected"
                :label="option.label"
                stack
                :style="{
                  color: !option.selected ? getOptionColor(option) : 'white',
                  background: getOptionColor(option),
                }"
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
    </q-card>

    <q-card class="text-primary" v-show="step === 'intensitySelect'">
      <q-card-section>
        <q-btn
          icon="eva-arrow-ios-back-outline"
          size="13px"
          @click="
            step = 'painSelect';
            optionsWithSelectedIntensity = [];
          "
          label="Voltar"
          :ripple="false"
          flat
        />
        <div
          class="row items-center justify-center text-body text-bold text-center q-mt-md q-mb-sm"
        >
          O quanto esses desafios interferem no seu dia a dia?
        </div>
        <div class="row q-col-gutter-md">
          <div
            class="col-xs-12 col-sm-6"
            :key="option.value"
            v-for="(option, index) in optionsToSelectIntensity"
          >
            <IntensitySelectModal
              :show="option.showIntensitySelect"
              :title="option.label"
              :intensity="option.intensity"
              :order="index + 1"
              :pain="option.value"
              @upIntensity="() => onUpIntensity(option)"
              @downIntensity="() => onDownIntensity(option)"
              @manualChangeIntensity="val => manualSetIntensity(option, val)"
            />
          </div>
        </div>
        <div class="row q-mt-md">
          <q-btn
            label="Confirmar"
            no-caps
            class="full-width no-border-radius"
            size="18px"
            @click="onConfirmIntensity"
            color="primary"
          />
        </div>
      </q-card-section>

      <q-card-section
        class="intensity-checked"
        v-show="optionsWithSelectedIntensity && optionsWithSelectedIntensity.length"
      >
        <div
          class="text-center pain-with-checked-intensity"
          :style="{
            'background-color': getOptionColor(option),
            color: 'white',
            fontSize: '15px',
          }"
          :key="index"
          v-for="(option, index) in optionsWithSelectedIntensity"
          @click="returnHiddenToIntensitySelect(option)"
        >
          {{ option.label }}
          <q-icon color="white" name="eva-arrow-ios-upward-outline" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Platform } from 'quasar';
import IntensitySelectModal from 'components/pain-intensity/IntensitySelectModal';

import { painColor } from 'boot/utils';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    IntensitySelectModal,
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
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Efeitos Colaterais',
          value: 'efeitos_colaterais',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Espiritualidade',
          value: 'espiritualidade',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Lidar com Emoções',
          value: 'lidar_com_emocoes',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Me Exercitar',
          value: 'me_exercitar',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Meus Direitos',
          value: 'meus_direitos',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Sexualidade',
          value: 'sexualidade',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
        {
          label: 'Vida após o Câncer',
          value: 'vida_apos_cancer',
          icon: '',
          selected: false,
          intensity: 0,
          showIntensitySelect: false,
          hidden: false,
        },
      ],
      optionsToSelectIntensity: [],
      optionsWithSelectedIntensity: [],
    };
  },

  methods: {
    returnHiddenToIntensitySelect(option) {
      const optionObj = this.optionsToSelectIntensity.find(o => o.value === option.value);
      if (optionObj) {
        optionObj.showIntensitySelect = true;
        optionObj.hidden = false;
        this.optionsWithSelectedIntensity = this.optionsToSelectIntensity.filter(o => o.hidden);
      }
    },
    getOptionColor(option) {
      return painColor(option.value);
    },
    hideModal() {
      this.$root.$emit('hideModal', 'principaisDores');
    },
    toggle(option) {
      option.selected = !option.selected;
      // se estiver selecionado, verifica quantidade selecionado e caso seja mais de 3 apresenta modal informativa
      if (option.selected && this.moreThanAcceptedQuantity) {
        this.$q.dialog({
          title: 'Atenção',
          message:
            'Selecione apenas 3 desafios, caso queira trocar desmarque uma opcao selecionada',
        });
        option.selected = false;
      }
    },
    goToIntensity() {
      this.options = [...this.options].map(o => ({
        ...o,
        showIntensitySelect: o.selected,
      }));
      this.optionsToSelectIntensity = this.options.filter(o => o.showIntensitySelect);
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
        this.$root.$emit('refreshCycleCronogram');
        this.$root.$emit('refreshClientCurrentCycle');
        this.$q.dialog({
          title: 'Obrigado pela interação!',
          message:
            'Nas próximas semanas abordaremos seus principais desafios por meio de dicas e conhecimentos práticos elaborados pelo nosso time de especialistas. Com conteúdos personalizados te ajudaremos na melhoria da sua qualidade de vida.',
          persistent: true,
        });
        // this.$root.$emit('showModal', 'cronogramaDoCiclo');
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
    onUpIntensity(option) {
      if (option.intensity < 10) {
        option.intensity += 1;
      }
    },
    onDownIntensity(option) {
      if (option.intensity > 0) {
        option.intensity -= 1;
      }
    },
    manualSetIntensity(option, val) {
      option.intensity = val;
    },
    onConfirmIntensity() {
      this.optionsToSelectIntensity.forEach(o => {
        const optionOnMainList = this.options.find(oo => oo.value === o.value);
        if (optionOnMainList) {
          optionOnMainList.intensity = o.intensity;
        }
      });
      this.saveSelectedOptionsAndClose();
    },
  },

  computed: {
    requiredAmount() {
      return 3;
    },
    selectedPains() {
      return [...this.options].filter(o => o.selected).sort((a, b) => (a.title > b.title ? 1 : -1));
    },
    amountOfSelectedOptions() {
      return this.options.filter(o => o.selected).length;
    },
    blockNextButton() {
      return this.amountOfSelectedOptions < this.requiredAmount;
    },
    pendingAmount() {
      return this.requiredAmount - this.amountOfSelectedOptions;
    },
    moreThanAcceptedQuantity() {
      return this.blockNextButton && this.amountOfSelectedOptions > this.requiredAmount;
    },
    buttonLabel() {
      // if (this.blockNextButton && this.pendingAmount < 0) {
      //   return 'Selecione somente 3 desafios';
      // }
      if (this.blockNextButton) {
        return `Falta${this.pendingAmount > 1 ? 'm' : ''} ${this.pendingAmount} desafio${
          this.pendingAmount > 1 ? 'es' : ''
        }`;
      }
      return 'Avançar';
    },
  },
};
</script>

<style scoped>
div.intensity-checked {
  width: 100%;
  padding: 0;
  z-index: 9999;
  position: fixed;
  bottom: 0;
}

div.pain-with-checked-intensity {
  padding: 15px;
  -webkit-box-shadow: 0px 1px 1px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 1px 1px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 1px 1px rgba(50, 50, 50, 0.75);
  color: white;
}
</style>
