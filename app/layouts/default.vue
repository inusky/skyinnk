<template>
  <Header />
  <slot />
  <Footer />
</template>

<script setup lang="ts">
import Header from '~/components/header.vue';
import Footer from '~/components/footer.vue';
</script>
