<template>
  <q-page>
    <div class="row">
      <div class="col-xs-12 ">
        <div class="row q-pa-md justify-end">
          <q-btn
            @click="openPendingNotifications"
            :disable="!pendingNotifications || !pendingNotifications.length"
            class="q-ml-sm"
            round
            :color="pendingNotifications && pendingNotifications.length ? 'orange' : 'grey'"
            icon="eva-bell-outline"
          >
            <q-badge
              v-show="pendingNotifications && pendingNotifications.length"
              color="red"
              floating
            >
              {{ pendingNotifications.length }}
            </q-badge>
          </q-btn>
          <q-btn
            @click="openPendingPROs"
            :disable="!pendingPROs || !pendingPROs.length"
            class="q-ml-sm"
            round
            :color="pendingPROs && pendingPROs.length ? 'pink' : 'grey'"
            label="PRO"
          >
            <q-badge v-show="pendingPROs && pendingPROs.length" color="red" floating>
              {{ pendingPROs.length }}
            </q-badge>
          </q-btn>
          <q-btn
            @click="openScheduleUpdate"
            :disable="!pendingSchedule"
            class="q-ml-sm"
            round
            :color="pendingSchedule ? 'blue' : 'grey'"
            icon="eva-calendar-outline"
          >
          </q-btn>
          <q-btn @click="openProfessionalChat" :disable="!professionalCycle" class="q-ml-sm" round>
            <q-avatar size="42px">
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
            <q-badge v-show="pendingMessages && pendingMessages.length" color="red" floating>
              {{ pendingMessages.length }}
            </q-badge>
            <q-icon
              name="eva-message-square"
              class="absolute"
              color="light-green-13"
              style="bottom: -5px; right: -5px;"
            />
          </q-btn>
        </div>
      </div>

      <div class="col-xs-12">
        <q-card flat bordered class="my-card bg-grey-2">
          <!-- <q-card-section v-if="professionalCycle">
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
          </div> -->

          <q-card-section v-show="currentCycle.startDate">
            <div class="text-subtitle q-mb-lg">Últimos artigo recomendado:</div>
            <InformativeContentList @onClickItem="onClickContent" :contents="cycleCronogram" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12">
        <q-card flat class="my-card" v-show="!currentCycle.startDate">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12">
                <div class="text-h6 q-mb-sm q-pl-sm q-pr-sm">
                  Criamos uma lista com alguns desafios que você pode estar enfrentando nesse
                  momento.
                </div>
                <div class="text-body q-pl-sm q-pr-sm">
                  Primeiro vamos falar dos seus Principais Desafios, identificá-los nos ajuda a
                  definir prioridades e a fazer escolhas. Dessa forma, estaremos mais próximos de
                  atingir nossos objetivos!
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

    <q-dialog persistent v-model="proModal">
      <q-card style="min-width: 90%;" class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-h6">{{ currentPROBeingAnswered.Pro.area }}</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-form @submit.prevent="savePROAnswers">
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div
                class="col-xs-12"
                :key="proQuestion.id"
                v-for="(proQuestion, index) in currentPROBeingAnswered.Pro.ProQuestions"
              >
                <div class="text-body text-bold">{{ index + 1 }}. {{ proQuestion.question }}:</div>
                <q-option-group
                  :required="true"
                  :options="mappedAnswers(proQuestion.ProQuestionAnswerOptions)"
                  label="Notifications"
                  :type="proQuestion.answerType"
                  v-model="proQuestion.clientAnswer"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Cancelar" color="negative" no-caps v-close-popup flat />
            <q-btn type="submit" label="Salvar respostas" color="primary" no-caps flat />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import _ from 'lodash';
import InformativeContentList from 'components/informative-content/InformativeContentList';
// import CycleProfessional from 'components/CycleProfessional';
// import ScheduleCard from 'components/ScheduleCard';
import {
  ionNewspaperOutline,
  ionCalendarOutline,
  ionBookmarksOutline,
  ionNotificationsOutline,
} from '@quasar/extras/ionicons-v5';

import * as UserService from '../../services/User';

export default {
  name: 'PageClientHome',

  components: {
    InformativeContentList,
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
      pendingPROs: [],
      pendingNotifications: [],
      scheduleActionsModal: false,
      cycleEventsChannel: null,
      pendingMessages: [],
      proModal: false,
      currentPROBeingAnswered: {
        Pro: {
          ProQuestions: [],
        },
        answers: {},
        questions: [],
      },
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
    mappedAnswers(proAnswers) {
      return proAnswers.map(answer => ({
        ...answer,
        label: answer.answer,
        value: answer.id,
      }));
    },
    async savePROAnswers() {
      // validate
      const currentPRO = this.currentPROBeingAnswered;
      const pro = currentPRO.Pro;
      const questions = pro.ProQuestions;
      const isInvalid = questions.some(question => {
        // check if empty answer
        return (
          !question.clientAnswer ||
          (question.answerType === 'checkbox' && !question.clientAnswer.length)
        );
      });
      if (isInvalid) {
        this.$q.notify({
          message: 'Por favor, responda todas as perguntas para salvar',
          color: 'negative',
        });
        return;
      }
      this.$q.loading.show();
      try {
        await this.$store.dispatch('cycle/savePROQuestionAnswer', {
          proMessageScheduleId: currentPRO.id,
          answers: questions.map(question => ({
            answer: question.clientAnswer,
            answerType: question.answerType,
            proQuestionId: question.id,
          })),
        });
        this.proModal = false;
        this.$q.notify({
          message: 'Obrigado pelas suas respostas',
          color: 'positive',
        });
        this.getPendingPRO();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao salvar as respotas',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
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
    openPendingPROs() {
      console.log(this.pendingPROs);
      const firstPendingPRO = this.pendingPROs[0];
      if (!firstPendingPRO) {
        return;
      }
      this.currentPROBeingAnswered = {
        ...firstPendingPRO,
        Pro: {
          ...firstPendingPRO.Pro,
          ProQuestions: firstPendingPRO.Pro.ProQuestions.map(proQuestion => ({
            ...proQuestion,
            clientAnswer: proQuestion.answerType === 'checkbox' ? [] : '',
          })),
        },
      };
      // currentPROBeingAnswered: {
      //   Pro: {},
      //   answers: {},
      //   questions: [],
      // },
      this.proModal = true;
    },
    async markMessageAsRead(message) {
      this.$q.loading.show();
      try {
        await this.$store.dispatch('cycle/updateMessageNotificationToRead', message.id);
        await this.getPendingNotifications();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao atualizar a mensagem',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    openPendingNotifications() {
      const lastNotification = this.pendingNotifications[this.pendingNotifications.length - 1];
      if (lastNotification) {
        this.$q
          .dialog({
            message: lastNotification.MotivationalMessage.text,
            persistent: true,
            ok: {
              label: 'Marcar como lida',
              flat: true,
              noCaps: true,
            },
          })
          .onOk(() => this.markMessageAsRead(lastNotification));
      }
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
          // console.log(UserService.getUser());
          const name = UserService.getUser().data.firstName;
          await this.$q
            .dialog({
              title: `Seja bem vindo(a) ${name}`,
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
          // console.log(professionalCycle);
          this.showDialogAndLinkToPNChat(professionalCycle.Professional);

          // GET CHAT
          const chat = await this.$store.dispatch(
            'cycle/createAndOpenChatWithProfessionalInCycle',
            this.currentCycle.id,
          );
          // get unread messages from chat
          this.pendingMessages = await this.$store.dispatch(
            'cycle/getUnreadMessagesFromChat',
            chat.id,
          );
          const channel = this.$pusher.subscribe(chat.code);
          channel.bind('chat-event', data => {
            const currentUserId =
              UserService.getUser() && UserService.getUser().data
                ? UserService.getUser().data.id
                : null;
            const newMessageUserId = data.userId;
            if (currentUserId !== newMessageUserId) {
              this.pendingMessages.push(data);
            }
          });
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
    async getPendingNotifications() {
      this.$q.loading.show();
      try {
        const notifications = await this.$store.dispatch('cycle/getNotifications');
        // console.log(notifications);
        this.pendingNotifications = notifications.filter(n => n.status === 'sent' && !n.readAt);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar as notificações pendentes',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async getPendingPRO() {
      this.$q.loading.show();
      try {
        const pros = await this.$store.dispatch('cycle/getPros');
        this.pendingPROs = pros.filter(n => n.status === 'sent' && !n.answeredAt);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar os PROs pendentes',
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
      this.pendingMessages = [];
      if (this.currentCycle.startDate) {
        this.refreshCycleCronogram();
        this.getProfessionalCycle();
        this.getPendingSchedules();
        this.getPendingNotifications();
        this.getPendingPRO();
      }
    },
  },
};
</script>
