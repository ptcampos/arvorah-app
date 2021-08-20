<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 text-center primary--text">
        <h5>Agendar uma teleconsulta</h5>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 text-center primary--text">
        <q-select
          :loading="loading"
          filled
          v-model="selectedArea"
          :options="healthAreas"
          option-value="value"
          option-label="text"
          label="Especialidade"
        />
      </div>
      <div class="col-xs-12 text-center primary--text">
        <q-select
          :loading="loading"
          filled
          v-model="newTeleconsultation.professionalId"
          :options="professionals"
          @input="filterDateSuggestions"
          option-value="id"
          option-label="nickname"
          label="Profissional"
        />
      </div>
      <div class="col-xs-12 q-mb-md text-center primary--text">
        <SelectInput
          :required="true"
          :options="dateSuggestions"
          label="Horário"
          v-model="selectedDateHour"
        />
      </div>
      <!-- <div class="col-xs-6 text-center primary--text">
        <q-input
          filled
          v-model="newTeleconsultation.date"
          type="date"
          mask="##/##/####"
          :min="minDate()"
          label="Data"
        />
      </div>
      <div class="col-xs-6 text-center primary--text">
        <q-input
          filled
          v-model="newTeleconsultation.hour"
          mask="time"
          :rules="['time']"
          label="Horário"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="newTeleconsultation.hour">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div> -->
    </div>
    <div class="col-xs-6 text-center primary--text">
      <q-btn
        @click="saveTeleconsultation()"
        color="primary"
        label="Agendar"
        no-caps
        dense
        style="width: 100%;"
      />
    </div>
  </q-page>
</template>

<script>
import SelectInput from 'components/SelectInput';
import moment from 'moment';

export default {
  components: {
    SelectInput,
  },
  data() {
    return {
      loading: true,
      healthAreas: [],
      professionals: [],
      selectedArea: null,
      selectedDateHour: '',
      newTeleconsultation: {
        date: new Date(),
        hour: '',
      },
      dateSuggestions: [
        {
          label: '[ Selecione um horário ]',
          value: '',
        },
      ],
    };
  },
  mounted() {
    this.getHealthAreas();
    moment.locale('pt-br');
  },
  methods: {
    async filterDateSuggestions(professional) {
      this.$q.loading.show();
      try {
        const dateSuggestions = await this.$axios
          .get(`/professional-cycle/get-professional-calendar-suggestion/${professional.id}`)
          .then(r => r.data)
          .then(r => r.result);
        const emptyDate = [
          {
            label: '[ Selecione um horário ]',
            value: '',
          },
        ];
        this.dateSuggestions = [
          ...emptyDate,
          ...dateSuggestions.map(d => ({
            label: `${d.date} - ${d.hour}`,
            value: `${d.date}_${d.hour}`,
          })),
        ];
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar os horários disponíveis',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async getHealthAreas() {
      const result = await this.$store.dispatch('professionals/getAreas');
      const areas = Object.entries(result).map(item => {
        return {
          value: item[0],
          text: item[1],
        };
      });
      this.healthAreas = areas;
      this.loading = false;
    },
    async getProfessionalsByArea() {
      const arr = [this.selectedArea];
      const result = await this.$store.dispatch('cycle/getProfessionalsBasedOnAreas', arr);
      this.professionals = result;
    },
    async saveTeleconsultation() {
      this.$q.loading.show();
      try {
        // newTeleconsultation
        // moment.locale('pt-br');
        const { selectedDateHour } = this;
        const arrSelected = selectedDateHour.split('_');
        const [date, hour] = arrSelected;
        this.newTeleconsultation.date = moment(date, 'DD/MM/YYYY').toDate();
        this.newTeleconsultation.hour = hour;
        await this.$store.dispatch('schedule/postDirectSchedule', {
          ...this.newTeleconsultation,
          type: 'teleconsulta',
          professionalId: this.newTeleconsultation.professionalId.id,
        });
        this.$q.notify({
          message: 'Sua teleconsulta foi criada com sucesso',
          color: 'positive',
        });
        setTimeout(() => {
          this.$router.push('/app/client/teleconsulta');
        }, 1500);
      } catch (error) {
        this.$q.notify({
          message: 'Erro ao cadastrar teleconsulta',
          color: 'negative',
        });
      }
      this.$q.loading.hide();
    },
    minDate() {
      moment.locale('pt-br');
      return moment()
        .add(1, 'days')
        .format('YYYY-MM-DD');
    },
  },
  watch: {
    selectedArea() {
      this.getProfessionalsByArea();
    },
  },
};
</script>

<style lang="sass" scoped></style>
