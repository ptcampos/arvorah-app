<template>
  <div class="row container shadow-1 bg-cyan" @click="$emit('onClick')">
    <div class="col-xs-2">
      <q-avatar color="white" text-color="dark" icon="eva-calendar" />
    </div>
    <div class="col-xs-8 text-white q-pl-md">
      <div class="columns full-height items-center justify-start">
        <div class="text-body">
          Você possui uma consulta agendada para o dia
          {{ pendingSchedule.dateHour | date('DD/MM/YYYY') }} às
          {{ pendingSchedule.dateHour | date('HH:mm') }}
        </div>
      </div>
    </div>
    <div class="col-xs-2">
      <div class="row full-height items-center justify-center">
        <q-btn :ripple="false" icon="eva-menu" flat color="white" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pendingSchedule: {
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
