<template>
  <section class="hero-container-bg">
    <div class="hero-bg-image">
      <NuxtImg
        :src="`${r2Url}?key=hero-bg-image.webp`"
        alt=""
        aria-hidden="true"
        quality="70"
        format="webp"
        preload
      />
    </div>
    <div class="hero-container container">
      <div class="hero-left">
        <div class="hero-text">
          <h1>Learning that inspires thinking, expression, and purpose.</h1>
        </div>
        <div class="hero-text">
          <div class="quote">
            <p class="first-line">A space where...</p>
            <p class="quote-text"><span>💡</span> curiosity expressed</p>
            <p class="quote-text"><span>✨</span> ideas made clear</p>
            <p class="quote-text"><span>🎯</span> learning with purpose</p>
            <p class="bottom-line">
              ... nurturing curiosity with clarity and confidence for every
              learner.
            </p>
          </div>
        </div>
      </div>
      <div class="hero-right">
        <NuxtImg
          :src="r2Url + '?key=hero-image-on-top.webp'"
          alt=""
          aria-hidden="true"
          quality="85"
          format="webp"
          preload
        />
        <div v-if="isSignedOut" class="cta">
          <button type="button" @click="goToAuth0">Join for free</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
const r2Url = ref('https://skyinnk-r2.skyinnk-api.workers.dev');
const { isSignedOut } = useAuthState();

const goToAuth0 = () => {
  const qs = new URLSearchParams({ returnTo: route.fullPath });
  window.location.href = `/auth/login?${qs.toString()}`;
};
</script>

<style scoped lang="scss">
@use '../assets/scss/components/home/hero-container' as *;
</style>
