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
          <!-- <q-btn
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
            @click="openPROReports"
            :disable="!clientProReport.report"
            class="q-ml-sm"
            round
            :color="clientProReport.report ? 'pink' : 'grey'"
            label="REL"
          >
          </q-btn> -->
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
              <img
                :src="
                  professionalCycle && professionalCycle.avatar
                    ? professionalCycle.avatar
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                "
              />
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
            <div class="text-subtitle q-mb-lg">Artigos recomendados:</div>
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
                  Identificar quais são os nossos principais desafios facilita a definição de
                  prioridades e a tomada de decisões. Por isso, criamos uma lista com alguns
                  desafios que você possa estar enfrentando nesse momento!
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
            <span class="text-weight-bold">Consulta Agendada</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator class="q-mb-sm" />

        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <span class="text-bold">Data da Consulta: </span
            >{{
              pendingSchedule && pendingSchedule.Schedule && pendingSchedule.Schedule.dateHour
                ? pendingSchedule.Schedule.dateHour
                : '' | date('DD/MM/YYYY HH:mm')
            }}
          </div>
          <div class="col-xs-12">
            <q-btn
              class="full-width"
              label="Cancelar"
              color="negative"
              no-caps
              @click="confirmCancelSchedule"
              v-close-popup
              v-if="this.pendingSchedule && this.pendingSchedule.Schedule.status === 'pending'"
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
          <div class="col-xs-12">
            <q-btn
              class="full-width"
              label="Acessar Sala Virtual"
              color="purple"
              no-caps
              @click="openVirtualRoom"
              v-if="this.pendingSchedule && this.pendingSchedule.Schedule.status === 'soon'"
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

    <q-dialog persistent maximized v-model="conferenceModal">
      <q-card class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-h6">Sala de Atendimento</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <div class="row">
            <div class="col-xs-12 col-sm-12">
              <div style="width: 100%;">
                <iframe
                  :src="
                    `${conference.url}?embed&iframeSource=example&screenshare=on&people=off&video=on`
                  "
                  allow="camera; microphone; fullscreen; speaker; display-capture"
                  style="width: 100%; height: 60vh;"
                  ref="iframe"
                ></iframe>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Fechar" color="negative" no-caps v-close-popup flat />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="clientProReportsModal">
      <q-card class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-weight-bold">Relatórios</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-list bordered separator>
            <q-item
              @click="openPROReport(report)"
              clickable
              v-ripple
              v-for="(report, index) in clientProReports"
              :key="report.id"
            >
              <q-item-section>
                {{ index + 1 }} -
                {{ report.createdAt | date('DD/MM/YYYY HH:mm') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-space />
          <q-btn v-close-popup flat label="Fechar" color="negative" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog persistent maximized v-model="proReportModal">
      <q-card class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-h6">Relatório</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <div class="row">
            <div class="col-xs-12 col-sm-12">
              <div style="width: 100%;" v-html="clientProReport.report" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Fechar" color="negative" no-caps v-close-popup flat />
        </q-card-actions>
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
      conferenceModal: false,
      proReportModal: false,
      proReport: null,
      clientProReport: {},
      conference: {
        url: '',
      },
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
      clientProReports: [],
      clientProReportsModal: false,
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

    this.$root.$on('refreshMotivationalMessages', () => {
      this.getPendingNotifications();
    });

    this.$root.$on('refreshPROMessages', () => {
      this.getPendingPRO();
    });

    this.$root.$on('refreshCycleCronogramInformativeContent', () => {
      this.refreshCycleCronogram();
    });
  },

  beforeDestroy() {
    this.$root.$off('refreshPROMessages');
    this.$root.$off('refreshMotivationalMessages');
    this.$root.$off('refreshCycleCronogram');
    this.$root.$off('refreshClientCurrentCycle');
  },

  methods: {
    openPROReport(clientReport) {
      this.clientProReport = clientReport ? { ...clientReport } : {};
      this.proReportModal = true;
    },
    async openPROReports() {
      this.$q.loading.show();
      try {
        const proReports = await this.$store.dispatch('cycle/getClientProReports');
        this.clientProReports = proReports;
        this.clientProReportsModal = true;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar os relatórios de PRO',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async openVirtualRoom() {
      // get professional settings
      const settings = this.professionalCycle.professionalSettings;
      if (settings.conferenceUrl) {
        this.conference.url = settings.conferenceUrl;
        this.conferenceModal = true;
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'A Pessoa Navegadora não configurou uma sala virtual',
        });
      }
    },
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
        const prosStatus = await this.$store.dispatch('cycle/savePROQuestionAnswer', {
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
        if (prosStatus.allAnswered) {
          this.clientProReport = { ...prosStatus.clientReport };
          this.proReportModal = true;
        }
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
    // showDialogAndLinkToPNChat() {
    //   // if (localStorage.getItem('pn-match')) {
    //   // }
    //   // this.$q
    //   //   .dialog({
    //   //     title: 'Que legal!',
    //   //     message: `Sabemos o quanto é importante podermos contar com uma rede de apoio e com calor humano durante os momentos desafiadores de nossa vida. Pensando nisso, gostaríamos de te apresentar a uma pessoa muito especial:  Sua navegadora ${professional.nickname}! Ela irá te ajudar a navegar durante todas as etapas de nossa jornada, e garantir que estejamos sempre alinhados com os seus objetivos e prioridades.`,
    //   //     persistent: true,
    //   //     ok: {
    //   //       flat: true,
    //   //       noCaps: true,
    //   //       color: 'primary',
    //   //       label: 'Clique aqui para saber mais',
    //   //     },
    //   //   })
    //   //   .onOk(() => {
    //   //     this.openProfessionalChat();
    //   //     localStorage.setItem('pn-match', 1);
    //   //   });
    // },
    async showRescheduleAlert() {
      this.$q
        .dialog({
          title: 'Atenção',
          message: 'Quer mesmo reagendar a consulta? Sua marcação previa será cancelada',
          ok: {
            label: 'Sim, reagendar',
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
          this.$q.loading.show();
          try {
            await this.$store.dispatch('cycle/cancelSchedule', this.pendingSchedule.scheduleId);
            const chat = await this.$store.dispatch(
              'cycle/createAndOpenChatWithProfessionalInCycle',
              this.currentCycle.id,
            );
            await this.$store.dispatch('cycle/sendProfessionalCalendarSuggestion', chat.code);
            // ir para o chat
            this.openProfessionalChat();
          } catch (error) {
            console.log(error);
            this.$q.notify({
              message: 'Erro ao solicitar novos horários para reagendamento',
              color: 'negative',
            });
          } finally {
            this.$q.loading.hide();
          }
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
                    'Identificar quais são os nossos principais desafios facilita a definição de prioridades e a tomada de decisões. Por isso, criamos uma lista com alguns desafios que você possa estar enfrentando nesse momento, selecione 03 opções!',
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
        // available contents
        const availableContents = cycleCronogram
          .filter(c => c.released)
          .sort((a, b) => (a.date > b.date ? -1 : 1));
        const notAvailableContents = cycleCronogram
          .filter(c => !c.released)
          .sort((a, b) => (a.date > b.date ? 1 : -1));
        this.cycleCronogram = [...availableContents, ...notAvailableContents];
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
        if (!professionalCycle) {
          return;
        }
        const professionalAvatar = await this.$store.dispatch(
          'user/getUserAvatarImage',
          professionalCycle.Professional.userId,
        );
        professionalCycle.avatar = `data:image/png;base64, ${professionalAvatar.base64}`;
        this.professionalCycle = professionalCycle;
        if (professionalCycle) {
          // console.log(professionalCycle);
          // this.showDialogAndLinkToPNChat(professionalCycle.Professional);

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
          this.cycleEventsChannel.bind('cycle-pn-match', () => {
            // this.showDialogAndLinkToPNChat(data);
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
    async getPROReport() {
      this.$q.loading.show();
      try {
        const clientReport = await this.$store.dispatch('cycle/getProReport');
        this.clientProReport = clientReport ? { ...clientReport } : {};
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar o PRO Report',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    onClickContent(item) {
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
        this.getPROReport();
      }
    },
  },
};
</script>
