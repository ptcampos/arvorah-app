<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn
          flat
          dense
          round
          :icon="ionMenuOutline"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          v-if="!isInternalPage"
          color="primary"
        />

        <q-btn
          flat
          dense
          round
          icon="eva-arrow-ios-back-outline"
          aria-label="Go Back"
          @click="goBack"
          v-if="isInternalPage"
          color="primary"
        />

        <q-toolbar-title class="row items-center">
          <span class="text-subtitle2">
            <img src="~/assets/logo_horizontal.png" style="height: 40px;" alt="" />
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      :no-swipe-open="isInternalPage"
      :no-swipe-close="isInternalPage"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Menu
        </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-item clickable @click.native="signOut">
          <q-item-section avatar>
            <q-icon name="eva-log-out-outline" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sair</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <PrincipaisDoresModal :show="principaisDoresModal" />
    <CronogramaDoCicloModal :show="cronogramaDoCicloModal" />
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';
import PrincipaisDoresModal from 'components/modals/PrincipaisDoresModal.vue';
import CronogramaDoCicloModal from 'components/modals/CronogramaDoCicloModal.vue';
import { ionMenuOutline } from '@quasar/extras/ionicons-v5';

import {
  Plugins,
  // PushNotification,
  // PushNotificationToken,
  // PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications } = Plugins;

import { goBack } from 'boot/utils';

const linksData = [
  {
    title: 'Home',
    icon: 'eva-home-outline',
    link: '/app/client/home',
  },
  {
    title: 'Configurações',
    icon: 'eva-settings-outline',
    link: '/app/settings',
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialLink, PrincipaisDoresModal, CronogramaDoCicloModal },
  data() {
    return {
      pageTitle: 'Arvorah',
      ionMenuOutline,
      isInternalPage: false,
      leftDrawerOpen: false,
      essentialLinks: linksData,
      principaisDoresModal: false,
      cronogramaDoCicloModal: false,
    };
  },

  mounted() {
    this.$root.$on('internalPage', isInternalPage => {
      this.isInternalPage = isInternalPage;
    });

    this.$root.$on('changeTitle', title => {
      this.pageTitle = title || 'Arvorah';
    });

    this.$root.$on('showModal', name => {
      if (this[`${name}Modal`] !== undefined) {
        this[`${name}Modal`] = true;
      }
    });

    this.$root.$on('hideModal', name => {
      if (this[`${name}Modal`] !== undefined) {
        this[`${name}Modal`] = false;
      }
    });

    this.saveDeviceToken();
  },

  methods: {
    goBack,
    saveDeviceToken() {
      PushNotifications.requestPermission().then(result => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', async token => {
        // save user token on WS
        this.$q.loading.show();
        try {
          await this.$store.dispatch('user/saveDeviceToken', {
            deviceToken: token.value,
          });
        } catch (error) {
          console.log(error);
          const message = 'Erro ao salvar o token do dispositivo';
          this.$q.notify({
            message,
            color: 'negative',
          });
        } finally {
          this.$q.loading.hide();
        }
      });

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', () => {
        const message = 'Erro ao salvar o token do dispositivo';
        this.$q.notify({
          message,
          color: 'negative',
        });
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived', () => {
        this.$root.$emit('refreshMotivationalMessages');
        this.$root.$emit('refreshPROMessages');
        this.$root.$emit('refreshCycleCronogramInformativeContent');
      });

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed', () => {
        this.$root.$emit('refreshMotivationalMessages');
        this.$root.$emit('refreshPROMessages');
        this.$root.$emit('refreshCycleCronogramInformativeContent');
      });
    },
    signOut() {
      this.$store.dispatch('user/signOut');
      this.$router.push({ path: '/login', query: { type: 'client' } });
    },
  },
};
</script>
