<template>
  <q-page id="chat-page">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-12">
        <q-scroll-area
          id="scrollArea"
          style="width: 100%; height: 100%; position: absolute;"
          ref="scrollArea"
          class="bg-grey-1"
        >
          <div class="rounded-borders q-pa-md chat-container">
            <q-banner
              v-show="(!messages || !messages.length) && !loading"
              class="bg-primary text-white rounded-borders"
            >
              Esse chat ainda não possui nenhuma mensagem
            </q-banner>
            <div :key="message.id" v-for="message in messages">
              <q-chat-message
                v-show="message.senderType !== 'system'"
                :name="message.User.firstName"
                :text="[message.message]"
                :sent="currentUser && currentUser.id === message.User.id"
              >
                <template v-slot:avatar>
                  <img
                    class="q-message-avatar q-message-avatar--received"
                    src="https://cdn.quasar.dev/img/avatar2.jpg"
                  />
                </template>
              </q-chat-message>

              <q-chat-message
                v-if="
                  message.senderType === 'system' && message.messageType === 'scheduleSuggestion'
                "
                :label="message.message"
                class="system-message"
                :class="{ 'system-message-interacted': message.eventInteracted }"
                @click="clickOnSystemMessage(message)"
              />

              <q-chat-message
                v-else-if="message.senderType === 'system'"
                :label="message.message"
                class="system-message-info"
              />
            </div>
            <q-chat-message v-show="otherUserTyping">
              <q-spinner-dots size="2rem" />
            </q-chat-message>
            <div class="hidden-element" ref="scrollTarget"></div>
          </div>
        </q-scroll-area>

        <q-footer elevated>
          <q-toolbar class="bg-grey-3 row">
            <q-form class="full-width" @submit="sendMessage">
              <q-input
                autofocus
                bg-color="grey-3"
                input-class="q-px-sm"
                placeholder="Mensagem"
                v-model="newMessage"
                autogrow
                @input="sendTypingEvent"
              >
                <template v-slot:append>
                  <q-btn @click="sendMessage" round dense flat icon="send" />
                </template>
              </q-input>
            </q-form>
          </q-toolbar>
        </q-footer>
      </div>
      <!-- <div class="col-xs-12 col-sm-4">
        <div class="bg-grey-2 rounded-borders q-pa-md">
          <div class="text-h6 q-mb-sm">Enviar:</div>
          <q-btn class="full-width" color="primary" label="Sugestão de Agenda" />
        </div>
      </div> -->
    </div>

    <q-dialog @hide="suggestions = []" v-model="calendarSugestionModal">
      <q-card style="min-width: 95%" class="q-pa-sm">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-weight-bold">Melhor data</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />

        <q-list bordered separator>
          <q-item
            @click="confirmSchedule(suggestion)"
            v-ripple
            clickable
            :key="index"
            v-for="(suggestion, index) in suggestions"
          >
            <q-item-section avatar>
              <q-icon name="eva-calendar" />
            </q-item-section>
            <q-item-section
              >{{ suggestion.date | date('DD/MM') }} às {{ suggestion.hour }} -
              {{ suggestion.date | date('dddd') }}</q-item-section
            >
          </q-item>
        </q-list>

        <q-separator />

        <q-card-actions vertical>
          <q-btn
            v-close-popup
            flat
            label="Não encontrei um horário disponível"
            color="warning"
            @click="sendHourNotFoundMessage"
            no-caps
          />
          <q-btn v-close-popup flat label="Cancelar" color="negative" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment';

import { getUser } from '../../services/User';

export default {
  props: ['chatCode'],

  data() {
    return {
      messages: [],
      newMessage: '',
      loading: true,
      otherUserTyping: false,
      calendarSugestionModal: false,
      suggestions: [],
      chatEvents: null,
    };
  },

  mounted() {
    this.init();

    this.$root.$emit('internalPage', true);
    this.$root.$emit('changeTitle', 'Chat');

    const currentUserId = getUser() && getUser().data ? getUser().data.id : null;

    this.chatEvents = this.$pusher.subscribe(this.chatCode);
    this.chatEvents.bind('chat-event', data => {
      const dupMessage = this.messages.find(m => m.id === data.id);
      if (!dupMessage) {
        this.messages.push(data);
        this.updateUnreadMessages([data.id]);
      }
      this.scrollBottom();
    });
    this.chatEvents.bind('chat-typing', data => {
      if (currentUserId) {
        if (data && data.value > 0 && data.userId !== currentUserId) {
          this.otherUserTyping = true;
        } else {
          this.otherUserTyping = false;
        }
      }
    });
  },

  destroyed() {
    // console.log('unsubscribe');
    this.$pusher.unsubscribe(this.chatCode);
  },

  methods: {
    scrolled() {
      // console.log('oi');
    },
    confirmSchedule(suggestion) {
      const date = moment(suggestion.date).format('DD/MM/YYYY');
      this.$q
        .dialog({
          message: `Você confirma o agendamento para a data ${date} às ${suggestion.hour} ?`,
          title: 'Atenção',
          ok: {
            label: 'Sim, confirmo',
            color: 'primary',
            noCaps: true,
            flat: true,
          },
          cancel: {
            label: 'Não, cancelar',
            color: 'negative',
            noCaps: true,
            flat: true,
          },
        })
        .onOk(async () => {
          this.$q.loading.show();
          try {
            // confirm schedule
            await this.$store.dispatch('cycle/schedule', {
              ...suggestion,
            });
            await this.sendSystemMessage({
              message: `A consulta foi agendada com sucesso para o dia ${date} às ${suggestion.hour}.`,
            });
            // update scheduleSuggestion message to interacted
            await this.$store.dispatch('cycle/updateMessageInteraction', {
              interactedMessageId: suggestion.chatMessageId,
              interacted: true,
            });
            const actionMessage = this.messages.find(m => m.id === suggestion.chatMessageId);
            if (actionMessage) {
              actionMessage.eventInteracted = true;
            }
            this.calendarSugestionModal = false;
            this.$q.notify({
              message: 'Evento confirmado com sucesso',
              color: 'positive',
            });
          } catch (error) {
            console.log(error);
            this.$q.notify({
              message: 'Erro ao agendar a consulta',
              color: 'negative',
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
    async clickOnSystemMessage(message) {
      if (message.messageType === 'scheduleSuggestion' && !message.eventInteracted) {
        this.$q.loading.show();
        try {
          const suggestions = await this.$store.dispatch(
            'cycle/getScheduleDateSuggestionsFromMessage',
            message.id,
          );
          this.suggestions = suggestions;
          this.calendarSugestionModal = true;
        } catch (error) {
          console.log(error);
          this.$q.notify({
            message: 'Erro ao recuperar as sugestões de data',
            color: 'negative',
          });
        } finally {
          this.$q.loading.hide();
        }
      }
    },
    sendTypingEvent(val) {
      this.$store.dispatch('cycle/sendTypingEvent', { chatCode: this.chatCode, value: val.length });
    },
    scrollBottom() {
      const { scrollArea } = this.$refs;
      if (!scrollArea) return;
      const scrollTarget = scrollArea.getScrollTarget();
      const duration = 0;
      setTimeout(() => {
        scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration);
      }, 1);
    },
    populateMessages() {},
    async updateUnreadMessages(unreadMessagesIds) {
      this.$q.loading.show();
      try {
        if (unreadMessagesIds && unreadMessagesIds.length) {
          await this.$store.dispatch('cycle/updateUnreadMessages', { unreadMessagesIds });
        }
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao atualizar as mensagens não lidas',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async init() {
      this.$q.loading.show();
      try {
        this.messages = await this.$store.dispatch('cycle/getChatMessages', this.chatCode);
        // batch update new messages case unread
        const unreadMessagesIds = this.messages.filter(m => !m.readMessageAt).map(m => m.id);
        this.scrollBottom();
        this.updateUnreadMessages(unreadMessagesIds);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao carregar as mensagens',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
        this.loading = false;
      }
    },
    async sendSystemMessage(data) {
      this.$q.loading.show();
      try {
        const message = await this.$store.dispatch('cycle/sendMessage', {
          chatCode: this.chatCode,
          message: data.message,
          system: true,
        });
        this.messages.push(message);
        this.scrollBottom();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao salvar a mensagem',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async sendHourNotFoundMessage() {
      this.$q.loading.show();
      try {
        const message = await this.$store.dispatch('cycle/sendMessage', {
          chatCode: this.chatCode,
          message: 'Não encontrei um horário disponível',
          autoMessage: true,
          messageType: 'no-schedule-found',
        });
        this.messages.push(message);
        this.newMessage = '';
        this.scrollBottom();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao enviar a mensagem',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async sendMessage() {
      if (!this.newMessage) {
        return;
      }
      this.$q.loading.show();
      try {
        this.$store.dispatch('cycle/sendTypingEvent', { chatCode: this.chatCode, value: 0 });
        const message = await this.$store.dispatch('cycle/sendMessage', {
          chatCode: this.chatCode,
          message: this.newMessage,
        });
        this.messages.push(message);
        this.newMessage = '';
        this.scrollBottom();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: 'Erro ao enviar a mensagem',
          color: 'negative',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },

  computed: {
    currentUser() {
      return getUser() ? getUser().data : null;
    },
  },
};
</script>

<style scoped>
.hidden-element {
  padding-top: 10px;
}
</style>
