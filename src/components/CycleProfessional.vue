<template>
  <div class="row container shadow-1 bg-dark" @click="$emit('onClick')">
    <div class="col-xs-2">
      <q-avatar color="white" text-color="dark" icon="eva-person" />
    </div>
    <div class="col-xs-8 text-white q-pl-md">
      <div class="columns full-height items-center justify-start">
        <div class="text-body text-bold">
          {{
            professionalCycle &&
            professionalCycle.Professional &&
            professionalCycle.Professional.nickname
              ? professionalCycle.Professional.nickname
              : 'Pessoa Navegadora'
          }}
        </div>
        <div class="text-body">{{ subtitle || 'Toque para abrir o Chat' }}</div>
      </div>
    </div>
    <div class="col-xs-2">
      <div class="row full-height items-center justify-center">
        <q-btn :ripple="false" icon="eva-arrow-right" flat color="white" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subtitle: {
      type: String,
    },
    professionalCycle: {
      type: Object,
    },
  },
};
</script>

<style scoped>
.container {
  border-radius: 5px;
  padding: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
