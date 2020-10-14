<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="ionMenuOutline"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          v-if="!isInternalPage"
        />

        <q-btn
          flat
          dense
          round
          icon="eva-arrow-ios-back-outline"
          aria-label="Go Back"
          @click="goBack"
          v-if="isInternalPage"
        />

        <q-toolbar-title class="row items-center">
          <span class="text-subtitle2">{{ pageTitle }}</span>
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

import { goBack } from 'boot/utils';

const linksData = [
  {
    title: 'Home',
    icon: 'eva-home-outline',
    link: '/app/client/home',
  },
  // {
  //   title: 'Agendar Consulta',
  //   icon: 'eva-book-outline',
  //   link: '/app/client/schedule-select-professional',
  // },
  // {
  //   title: 'Compromissos',
  //   icon: 'eva-calendar-outline',
  //   link: '/app/client/compromises',
  // },
  // {
  //   title: 'Notificações',
  //   icon: 'eva-bell-outline',
  //   link: '/app/client/notifications',
  // },
  // {
  //   title: 'Notícias',
  //   icon: 'eva-clipboard-outline',
  //   link: '/app/client/news',
  // },
  {
    title: 'Configurações',
    icon: 'eva-settings-outline',
    link: '/app/client/settings',
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialLink, PrincipaisDoresModal, CronogramaDoCicloModal },
  data() {
    return {
      pageTitle: 'Saúde Integrativa',
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
      this.pageTitle = title || 'Saúde Integrativa';
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
  },

  methods: {
    goBack,
    signOut() {
      this.$store.dispatch('user/signOut');
      this.$router.push({ path: '/login', query: { type: 'client' } });
    },
  },
};
</script>
