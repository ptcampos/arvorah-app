<template>
  <q-carousel
    v-model="slide"
    transition-prev="scale"
    transition-next="scale"
    swipeable
    animated
    control-color="white"
    navigation
    padding
    arrows
    height="300px"
    class="bg-brown text-white shadow-1 rounded-borders"
  >
    <q-carousel-slide name="slide1" class="column no-wrap flex-center">
      <div class="q-mt-md text-center">
        {{ lorem }}
      </div>
    </q-carousel-slide>
    <q-carousel-slide name="tv" class="column no-wrap flex-center">
      <div class="q-mt-md text-center">
        {{ lorem }}
      </div>
    </q-carousel-slide>
    <q-carousel-slide name="layers" class="column no-wrap flex-center">
      <div class="q-mt-md text-center">
        {{ lorem }}
      </div>
    </q-carousel-slide>
    <q-carousel-slide name="map" class="column no-wrap flex-center">
      <div class="q-mt-md text-center">
        {{ lorem }}
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
export default {
  data() {
    return {
      slide: 'slide1',
      lorem:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, perspiciatis nam! Esse animi harum, architecto cupiditate laudantium consectetur dolore numquam non vel provident odit repudiandae ipsa est, voluptatibus illum a!',
    };
  },
};
</script>

<style></style>
