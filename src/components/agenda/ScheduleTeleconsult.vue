<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12">
      <!-- {
            label: 'Fisioterapia',
            value: 'fisioterapia',
          }, -->
      <SelectInput
        label="Escolha uma especialidade"
        :options="[
          {
            label: 'Enfermagem',
            value: 'enfermagem',
          },
          {
            label: 'Cardiologia',
            value: 'cardiologia',
          },
          {
            label: 'Psicologia',
            value: 'psicologia',
          },
          {
            label: 'Nutrição',
            value: 'nutricao',
          },
        ]"
        @change="updateProfessionalsList"
        :required="true"
        v-model="schedule.healthArea"
      />
    </div>
    <div class="col-12">
      <SelectInput
        label="Profissional"
        :options="formattedProfessionals"
        :required="true"
        v-model="schedule.professionalId"
      />
    </div>
    <div class="col-6">
      <DateInput label="Data" mask="##/##/####" :required="true" v-model="schedule.date" />
    </div>
    <div class="col-6">
      <TextInput label="Hora" mask="##:##" :required="true" v-model="schedule.hour" />
    </div>
  </div>
</template>

<script>
import SelectInput from 'components/SelectInput';
import TextInput from 'components/TextInput';
import DateInput from 'components/DateInput';

export default {
  props: ['schedule'],

  components: {
    SelectInput,
    TextInput,
    DateInput,
  },

  data() {
    return {
      professionals: [],
    };
  },

  methods: {
    async updateProfessionalsList(healthArea) {
      this.schedule.professionalId = '';
      this.schedule.healthArea = healthArea;
      this.$q.loading.show();
      try {
        this.professionals = await this.$axios
          .get('/professionals', {
            params: {
              healthArea,
            },
          })
          .then(r => r.data)
          .then(r => r.result);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar a lista de Profissionais',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },

  computed: {
    formattedProfessionals() {
      const empty = [
        {
          label: 'Selecione um profissional',
          value: '',
        },
      ];
      return [
        ...empty,
        ...this.professionals.map(p => ({
          label: p.nickname,
          value: p.id,
        })),
      ];
    },
  },
};
</script>

<style></style>
