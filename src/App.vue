<template>
  <div id="q-app">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      appear
      :duration="300"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import moment from 'moment';

moment.locale('pt-BR');

export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
}
</style>
