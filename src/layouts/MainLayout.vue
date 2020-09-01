<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Saude Integrativa
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
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
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';

const linksData = [
  {
    title: 'Home',
    icon: 'eva-home-outline',
    link: '/app',
  },
  {
    title: 'Agendar Consulta',
    icon: 'eva-book-outline',
    link: '/app/client/schedule',
  },
  {
    title: 'Compromissos',
    icon: 'eva-calendar-outline',
    link: '/app/client/compromises',
  },
  {
    title: 'Notificações',
    icon: 'eva-bell-outline',
    link: '/app/client/notifications',
  },
  {
    title: 'Notícias',
    icon: 'eva-clipboard-outline',
    link: '/app/client/news',
  },
  {
    title: 'Configurações',
    icon: 'eva-settings-outline',
    link: '/app/client/settings',
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },

  methods: {
    signOut() {
      this.$store.dispatch('user/signOut');
      this.$router.push('/account-type');
    },
  },
};
</script>
