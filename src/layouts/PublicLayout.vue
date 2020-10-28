<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <OnboardingModal :show="onboardingModal" />
  </q-layout>
</template>

<script>
import OnboardingModal from 'components/modals/Onboarding.vue';

export default {
  data() {
    return {
      onboardingModal: false,
    };
  },

  components: {
    OnboardingModal,
  },

  mounted() {
    // if first access open onboardingModal
    setTimeout(() => {
      const showOnboarding = localStorage.getItem('showModal');
      if (!showOnboarding) {
        this.onboardingModal = true;
      }
    }, 1);

    this.$root.$on('hideOnboardingModal', () => {
      setTimeout(() => {
        this.onboardingModal = false;
      }, 1);
    });
  },
};
</script>
