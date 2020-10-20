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
            placeholder="Filtrar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-form>
      </div>
      <div class="col-xs-12">
        <SelectButtonsGroup :options="painOptions" @onClick="onClickArea" />
      </div>
      <div class="col-xs-12">
        <InformativeContentList
          v-show="!loading"
          @onClickItem="onClickContent"
          :contents="contentsToShow"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import SelectButtonsGroup from 'components/SelectButtonsGroup';
import InformativeContentList from 'components/informative-content/InformativeContentList';

import { copy, painDescription, painIcon } from 'boot/utils';

export default {
  components: {
    SelectButtonsGroup,
    InformativeContentList,
  },

  data() {
    return {
      search: '',
      loading: false,
      loadingSearch: false,
      allInformativeContents: [],
      contentsToShow: [],
      painOptions: [],
    };
  },

  mounted() {
    this.$root.$emit('internalPage', false);
    this.$root.$emit('changeTitle', 'Conteúdo Informativo');

    this.refreshCycleInformativeContent();
  },

  methods: {
    async refreshCycleInformativeContent() {
      this.$q.loading.show();
      try {
        const currentUserCycle = await this.$store.dispatch('cycle/getUserCycle');
        this.currentCycle = currentUserCycle;
        if (currentUserCycle) {
          // get cronograma do ciculo
          const cycleCronogram = await this.$store.dispatch(
            'cycle/getCycleCronogram',
            currentUserCycle.id,
          );
          this.allInformativeContents = cycleCronogram;
          this.contentsToShow = copy(cycleCronogram);

          const cyclePains = await this.$store.dispatch('cycle/getCyclePains', currentUserCycle.id);
          // console.log(cyclePains);
          this.painOptions = cyclePains.map(cyclePain => ({
            ...cyclePain,
            icon: painIcon(cyclePain.pain),
            label: painDescription(cyclePain.pain),
            value: cyclePain.pain,
            selected: false,
          }));
        }
      } catch (error) {
        // console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar o cronograma do ciclo',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    onClickArea(payload) {
      this.loading = true;
      this.painOptions = this.painOptions.map((a, index) => ({
        ...a,
        selected: index === payload.index && !payload.option.selected,
      }));
      if (payload.option.selected) {
        this.contentsToShow = copy(this.allInformativeContents);
        this.loading = false;
        return;
      }
      this.contentsToShow = this.allInformativeContents.filter(
        p => p.InformativeModuleCyclePain.CyclePain.pain === payload.option.value,
      );
      this.loading = false;
    },
    onClickContent(item) {
      this.$store.dispatch('cycle/setCurrentInformativeContent', item);
      this.$router.push(`/app/client/informative-content/${item.id}`);
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
