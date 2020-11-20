<template>
  <q-page>
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered class="my-card bg-grey-2">
          <q-card-section class="">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <q-list>
                  <q-item tag="label">
                    <q-item-section>
                      <q-item-label>Seu Plano:</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="" v-show="currentCycle.startDate">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <q-list>
                  <q-item tag="label">
                    <q-item-section>
                      <q-item-label>Início:</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ currentCycle.startDate | date('DD/MM/YYYY') }}
                    </q-item-section>
                  </q-item>
                  <q-item tag="label">
                    <q-item-section>
                      <q-item-label>Fim:</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ currentCycle.endDate | date('DD/MM/YYYY') }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section v-if="professionalCycle">
            <CycleProfessional
              :professionalCycle="professionalCycle"
              @onClick="openProfessionalChat"
            />
          </q-card-section>

          <q-separator />

          <q-card-section v-show="currentCycle.startDate">
            <InformativeContentList @onClickItem="onClickContent" :contents="cycleCronogram" />
          </q-card-section>

          <q-card-section class="" v-show="!currentCycle.startDate">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <q-banner class="bg-info rounded-borders text-white">
                  Preencha os Desafios para acessar o conteúdo informativo.
                </q-banner>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12">
        <q-card flat class="my-card" v-show="!currentCycle.startDate">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <q-btn
                  color="secondary"
                  class="q-mt-sm full-width q-py-sm"
                  label="Preencher Desafios"
                  @click="$root.$emit('showModal', 'principaisDores')"
                  no-caps
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import InformativeContentList from 'components/informative-content/InformativeContentList';
import CycleProfessional from 'components/CycleProfessional';

import {
  ionNewspaperOutline,
  ionCalendarOutline,
  ionBookmarksOutline,
  ionNotificationsOutline,
} from '@quasar/extras/ionicons-v5';

export default {
  name: 'PageClientHome',

  components: {
    InformativeContentList,
    CycleProfessional,
  },

  data() {
    return {
      ionNewspaperOutline,
      ionCalendarOutline,
      ionBookmarksOutline,
      ionNotificationsOutline,
      currentCycle: {},
      cycleCronogram: [],
      professionalCycle: null,
    };
  },

  mounted() {
    this.$root.$emit('internalPage', false);
    this.$root.$emit('changeTitle');
    // get current user cycle. if any, show modal
    this.init();

    this.$root.$on('refreshClientCurrentCycle', () => {
      this.refreshCurrentCycle();
    });

    this.$root.$on('refreshCycleCronogram', () => {
      this.init();
    });
  },

  methods: {
    openProfessionalChat() {
      console.log('openProfessionalChat');
    },
    showPrincipaisDoresModal() {
      setTimeout(() => {
        this.$root.$emit('showModal', 'principaisDores');
      }, 100);
    },
    async refreshCurrentCycle() {
      this.$q.loading.show();
      try {
        const currentUserCycle = await this.$store.dispatch('cycle/getUserCycle');
        if (!currentUserCycle || !currentUserCycle.active) {
          // this.showPrincipaisDoresModal();
        } else {
          this.currentCycle = currentUserCycle;
        }
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
          message: `Erro ao recuperar as informações do ciclo ${errorReason}`,
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async refreshCycleCronogram() {
      this.$q.loading.show();
      try {
        const cycleCronogram = await this.$store.dispatch(
          'cycle/getCycleCronogram',
          this.currentCycle.id,
        );
        this.cycleCronogram = cycleCronogram.sort((a, b) => (a.id > b.id ? 1 : -1));
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
    async getProfessionalCycle() {
      this.$q.loading.show();
      try {
        const professionalCycle = await this.$store.dispatch(
          'cycle/getProfessionalCycleWithStatus',
          {
            cycleId: this.currentCycle.id,
            status: 'accepted',
          },
        );
        console.log(professionalCycle);
        this.professionalCycle = professionalCycle;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao recuperar as informações do Profissional',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    onClickContent(item) {
      if (!item.released) {
        return;
      }
      this.$store.dispatch('cycle/setCurrentInformativeContent', item);
      this.$router.push(`/app/client/informative-content/${item.id}`);
    },
    async init() {
      await this.refreshCurrentCycle();
      if (this.currentCycle.startDate) {
        this.refreshCycleCronogram();
        this.getProfessionalCycle();
      }
    },
  },
};
</script>
