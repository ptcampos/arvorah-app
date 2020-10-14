<template>
  <q-page padding class="fit column justify-between items-center content-center bg">
    <div class="q-mt-lg q-pl-lg q-pr-lg q-pt-lg">
      <div class="title">
        Bem-vindo ao
        <div class="title-destaque">Medicina Integrativa</div>
      </div>
    </div>
    <div class="text-center">
      <img class="img" src="~assets/video-chamada.png" alt="" />
    </div>
    <div class="btn-container">
      <q-btn
        @click="$router.push({ path: '/login', query: { type: 'client' } })"
        color="secondary"
        round
        class="full-width"
        size="40px"
        icon="eva-arrow-forward-outline"
      />
    </div>
  </q-page>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.img
  max-width: 80%;

.p-t-40
  padding-top: 50px;

.btn-container
  display: block;
  position: relative;

.title
  font-size: 2em;

.title-destaque
  color: $primary
  font-weight: 600;

.bg
  background: url(~assets/bg-welcome.png)  no-repeat center center fixed
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
</style>
