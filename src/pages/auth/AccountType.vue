<template>
  <q-page padding class="fit column items-center content-center bg">
    <div class="q-mt-lg q-pl-lg q-pr-lg q-pt-lg">
      <div class="title">
        Para começar
        <div class="title-destaque">Escolha o seu tipo de conta</div>
      </div>
    </div>
    <div class="text-center q-pt-lg">
      <!-- <img class="img" src="~assets/video-chamada.png" alt="" /> -->
      <div class="row q-col-gutter-md">
        <div class="col-xs-12">
          <q-btn
            @click="$router.push({ path: '/login', query: { type: 'client' } })"
            no-caps
            color="grey-1"
            rounded
            style="border: #ddd 2px solid; padding: 10px 30px 3px;"
          >
            <div class="column">
              <img width="170px" class="img" src="~assets/casal.png" />
              <div class="text-h6 text-black">Paciente</div>
            </div>
          </q-btn>
        </div>
        <div class="col-xs-12">
          <q-btn
            @click="$router.push({ path: '/login', query: { type: 'professional' } })"
            no-caps
            color="grey-1"
            rounded
            style="border: #ddd 2px solid; padding: 3px 30px;"
          >
            <div class="column">
              <img width="170px" class="img" src="~assets/casal2.png" />
              <div class="text-h6 text-black">Profissional</div>
            </div>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.img
  max-width: 100%;

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
