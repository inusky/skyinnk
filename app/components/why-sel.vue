<template>
  <section class="why-sel-wrap">
    <div class="why__header container">
      <h1>Why Skyinnk</h1>
      <hr />
    </div>
    <div class="why-sel container">
      <div class="why__card">
        <div class="why_note">
          <h1>One-to-One Learning</h1>
        </div>
        <div class="why_media">
          <div class="why_image">
            <NuxtImg
              :src="`${r2Url}?key=one-to-one-learning.webp`"
              alt=""
              aria-hidden="true"
              quality="80"
            />
          </div>
        </div>
        <div class="why_text">
          We teach students one-to-one, focusing on one learner at a time.
        </div>
      </div>
      <div class="why__card why_center">
        <div class="why_note">
          <h1>Concept Clarity Over Speed</h1>
        </div>
        <div class="why_media">
          <div class="why_image">
            <NuxtImg
              :src="`${r2Url}?key=concept-clarity.webp`"
              alt=""
              aria-hidden="true"
              quality="80"
            />
          </div>
        </div>
        <div class="why_text">
          Every student learns differently. We slow down where needed.
        </div>
      </div>
      <div class="why__card">
        <div class="why_note">
          <h1>Continuous Progress Tracking</h1>
        </div>
        <div class="why_media">
          <div class="why_image">
            <NuxtImg
              :src="`${r2Url}?key=progress-tracking.webp`"
              alt=""
              aria-hidden="true"
              quality="80"
            />
          </div>
        </div>
        <div class="why_text">
          We create detailed progress reports for every student. These reports
          highlight understanding
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const r2Url = ref('https://skyinnk-r2.skyinnk-api.workers.dev');
</script>

<style scoped lang="scss">
@use '../assets/scss/components/home/why-sel' as *;
</style>
