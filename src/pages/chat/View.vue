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
            <q-chat-message
              :key="message.id"
              v-for="message in messages"
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

              <!-- <q-spinner-dots size="2rem" /> -->
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
  </q-page>
</template>

<script>
import { getUser } from '../../services/User';

export default {
  props: ['chatCode'],

  data() {
    return {
      messages: [],
      newMessage: '',
      loading: true,
    };
  },

  mounted() {
    this.init();

    this.$root.$emit('internalPage', true);
    this.$root.$emit('changeTitle', 'Chat');

    const channel = this.$pusher.subscribe(this.chatCode);
    channel.bind('chat-event', data => {
      const dupMessage = this.messages.find(m => m.id === data.id);
      if (!dupMessage) {
        this.messages.push(data);
      }
      this.scrollBottom();
    });
  },

  methods: {
    scrolled() {
      // console.log('oi');
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
    async init() {
      this.$q.loading.show();
      try {
        this.messages = await this.$store.dispatch('cycle/getChatMessages', this.chatCode);
        this.scrollBottom();
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
    async sendMessage() {
      if (!this.newMessage) {
        return;
      }
      this.$q.loading.show();
      try {
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
