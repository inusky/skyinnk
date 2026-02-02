<template>
  <HeroContainer />

  <FewCourses />

  <WhySel />

  <Purpose />

  <Faq />
</template>

<script setup lang="ts">
import Faq from '~/components/faq.vue';
import FewCourses from '~/components/few-courses.vue';
import HeroContainer from '~/components/hero-container.vue';
import Purpose from '~/components/purpose.vue';
import WhySel from '~/components/why-sel.vue';
</script>

<style scoped lang="scss">
@use '../assets/scss/components/home/home' as *;
</style>
