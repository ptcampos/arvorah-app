<template>
  <q-page>
    <div class="row">
      <div class="col-xs-12">
        <q-card flat bordered class="my-card bg-grey-2">
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

          <div v-if="pendingSchedule">
            <q-card-section>
              <ScheduleCard :pendingSchedule="pendingSchedule" @onClick="openScheduleUpdate" />
            </q-card-section>

            <q-separator />
          </div>

          <q-card-section v-show="currentCycle.startDate">
            <div class="text-subtitle q-mb-lg">Conteúdo Informativo:</div>
            <InformativeContentList @onClickItem="onClickContent" :contents="cycleCronogram" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12">
        <q-card flat class="my-card" v-show="!currentCycle.startDate">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <div class="text-h6 q-mb-sm">
                  Criamos uma lista com alguns desafios que você pode estar enfrentando nesse
                  momento.
                </div>
                <q-btn
                  color="secondary"
                  class="q-mt-sm full-width q-py-sm"
                  label="Clique aqui para começar"
                  @click="$root.$emit('showModal', 'principaisDores')"
                  no-caps
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="scheduleActionsModal">
      <q-card style="min-width: 80%;" class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-weight-bold">Ações</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-btn
              class="full-width"
              label="Cancelar"
              color="negative"
              no-caps
              @click="confirmCancelSchedule"
              v-close-popup
            />
          </div>
          <div class="col-xs-12">
            <q-btn
              class="full-width"
              label="Reagendar"
              color="primary"
              no-caps
              @click="showRescheduleAlert"
              v-close-popup
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import _ from 'lodash';
import InformativeContentList from 'components/informative-content/InformativeContentList';
import CycleProfessional from 'components/CycleProfessional';
import ScheduleCard from 'components/ScheduleCard';

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
    ScheduleCard,
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
      pendingSchedule: null,
      scheduleActionsModal: false,
      cycleEventsChannel: null,
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
    showDialogAndLinkToPNChat(professional) {
      if (localStorage.getItem('pn-match')) {
        return;
      }
      this.$q
        .dialog({
          title: 'Que legal!',
          message: `Sabemos o quanto é importante podermos contar com uma rede de apoio e com calor humano durante os momentos desafiadores de nossa vida. Pensando nisso, gostaríamos de te apresentar a uma pessoa muito especial:  Sua navegadora ${professional.nickname}! Ela irá te ajudar a navegar durante todas as etapas de nossa jornada, e garantir que estejamos sempre alinhados com os seus objetivos e prioridades.`,
          persistent: true,
          ok: {
            flat: true,
            noCaps: true,
            color: 'primary',
            label: 'Clique aqui para saber mais',
          },
        })
        .onOk(() => {
          this.openProfessionalChat();
          localStorage.setItem('pn-match', 1);
        });
    },
    showRescheduleAlert() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Para reagendar, solicite à sua Pessoa Navegadora pelo Chat',
      });
    },
    confirmCancelSchedule() {
      this.$q
        .dialog({
          title: 'Atenção',
          message: 'Quer mesmo cancelar o agendamento da consulta?',
          ok: {
            label: 'Sim, cancelar',
            flat: true,
            noCaps: true,
            color: 'primary',
          },
          cancel: {
            label: 'Não',
            flat: true,
            noCaps: true,
            color: 'negative',
          },
        })
        .onOk(async () => {
          // update event status to cancelled if date is not passed
          this.$q.loading.show();
          try {
            await this.$store.dispatch('cycle/cancelSchedule', this.pendingSchedule.scheduleId);
            this.init();
            this.$q.notify({
              message: 'O evento foi cancelado com sucesso',
              color: 'positive',
            });
          } catch (error) {
            console.log(error);
            this.$q.notify({
              message: 'Erro ao cancelar o agendamento, peça para um cancelamento manual',
              color: 'negative',
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
    async openProfessionalChat() {
      this.$q.loading.show();
      try {
        // console.log(this.currentCycle);
        const chat = await this.$store.dispatch(
          'cycle/createAndOpenChatWithProfessionalInCycle',
          this.currentCycle.id,
        );
        this.$router.push(`/app/client/current-cycle/chat/${chat.code}`);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao recuperar as informações do Chat',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    openScheduleUpdate() {
      this.scheduleActionsModal = true;
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
          await this.$q
            .dialog({
              title: `Seja bem vindo(a) XXX`,
              message:
                'Parabéns por ter aceitado o desafio de assumir o controle de sua própria jornada!. Estamos muito felizes em poder fazer parte de sua história, e seremos sempre gratos pela sua confiança!',
              persistent: true,
              ok: {
                label: 'Continuar',
                noCaps: true,
                flat: true,
              },
            })
            .onOk(async () => {
              await this.$q
                .dialog({
                  title: 'Queremos te conhecer melhor',
                  message:
                    'Primeiro vamos falar dos seus Principais Desafios, identificá-los nos ajuda a definir prioridades e a fazer escolhas. Dessa forma, estaremos mais próximos de atingir nossos objetivos!',
                  persistent: true,
                  ok: {
                    label: 'Continuar',
                    noCaps: true,
                    flat: true,
                  },
                })
                .onOk(() => {
                  this.$root.$emit('showModal', 'principaisDores');
                });
            });
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
        this.professionalCycle = professionalCycle;
        if (professionalCycle) {
          this.showDialogAndLinkToPNChat(professionalCycle);
        } else if (!this.cycleEventsChannel) {
          // register pusher event
          this.cycleEventsChannel = this.$pusher.subscribe(`cycle-events-${this.currentCycle.id}`);
          this.cycleEventsChannel.bind('cycle-pn-match', data => {
            this.showDialogAndLinkToPNChat(data);
          });
        }
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
    async getPendingSchedules() {
      this.$q.loading.show();
      try {
        const pendingSchedules = await this.$store.dispatch('cycle/listPendingSchedule');
        this.pendingSchedule = _.head(pendingSchedules);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar os agendamentos pendentes',
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
        this.getPendingSchedules();
      }
    },
  },
};
</script>
