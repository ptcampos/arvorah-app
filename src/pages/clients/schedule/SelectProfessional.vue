<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12">
        <q-form @submit="filterProfessionals">
          <q-input
            v-model="search"
            outlined
            debounce="500"
            filled
            :loading="loadingSearch"
            placeholder="Nome ou Especialidade"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-form>
      </div>
      <div class="col-xs-12">
        <SelectButtonsGroup :options="healthAreasOptions" @onClick="onClickHealthArea" />
      </div>
      <div class="col-xs-12">
        <ProfessionalsList
          @onClickItem="onClickProfessional"
          :professionals="professionalsToShow"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import SelectButtonsGroup from 'components/SelectButtonsGroup';
import ProfessionalsList from 'components/professionals/ProfessionalsList';

import { copy } from 'boot/utils';

const professionalsExample = [
  {
    id: 1,
    name: 'Hans Down',
    rating: 4.0,
    city: 'Brasília, DF',
    healthArea: 'atividade-fisica',
    healthAreaDescription: 'Educador Físico',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
  {
    id: 2,
    name: 'Hans Down',
    rating: 4.0,
    city: 'Brasília, DF',
    healthArea: 'psicologia',
    healthAreaDescription: 'Psicologia',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
  {
    id: 3,
    name: 'Hans Down',
    rating: 4.0,
    city: 'Brasília, DF',
    healthArea: 'psicologia',
    healthAreaDescription: 'Psicologia',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
  {
    id: 4,
    name: 'Hans Down',
    rating: 4.0,
    city: 'Brasília, DF',
    healthArea: 'nutricao',
    healthAreaDescription: 'Nutrição',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
  {
    id: 5,
    name: 'Hans Down',
    rating: 4.0,
    city: 'Brasília, DF',
    healthArea: 'nutricao',
    healthAreaDescription: 'Nutrição',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
  {
    id: 6,
    name: 'Hans Down',
    rating: 4.0,
    city: 'Brasília, DF',
    healthArea: 'atividade-fisica',
    healthAreaDescription: 'Educador Físico',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
];

export default {
  components: {
    SelectButtonsGroup,
    ProfessionalsList,
  },

  data() {
    return {
      search: '',
      loadingSearch: false,
      professionalsToShow: [],
      healthAreasOptions: [
        { icon: 'img:icons/fruit.svg', label: 'Nutrição', value: 'nutricao', selected: false },
        { icon: 'img:icons/brain.svg', label: 'Psicologia', value: 'psicologia', selected: false },
        {
          icon: 'img:icons/yoga.svg',
          label: 'Atividade Física',
          value: 'atividade-fisica',
          selected: false,
        },
      ],
    };
  },

  mounted() {
    this.$root.$emit('internalPage', false);
    this.$root.$emit('changeTitle', 'Selecione um Profissional');
    this.professionalsToShow = copy(professionalsExample);
  },

  methods: {
    onClickHealthArea(payload) {
      this.healthAreasOptions = this.healthAreasOptions.map((a, index) => ({
        ...a,
        selected: index === payload.index && !payload.option.selected,
      }));
      const allProfessionals = copy(professionalsExample);
      if (payload.option.selected) {
        this.professionalsToShow = allProfessionals;
        return;
      }
      this.professionalsToShow = allProfessionals.filter(
        p => p.healthArea === payload.option.value,
      );
    },
    onClickProfessional(professional) {
      this.$router.push(`/app/client/schedule-select-date/${professional.id}`);
    },
    filterProfessionals() {
      this.loadingSearch = true;
      this.loadingSearch = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.title
  font-size: 1.3em;

.title-destaque
  color: $primary
  font-weight: 600;
</style>
