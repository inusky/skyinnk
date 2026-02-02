<template>
  <section class="purpose" :class="{ 'is-playing': isPlaying }" id="purpose">
    <div class="purpose__inner container">
      <div v-show="!isPlaying" class="purpose__text">
        <h2 class="purpose__title">Our Purpose, In Our Own Words</h2>

        <p class="purpose__lead">
          Education is about truly understanding concepts, building confidence,
          and growing step by step — at a pace that feels right for every
          learner.
        </p>

        <h3 class="purpose__sub">At Skyinnk, we believe:</h3>

        <ul class="purpose__list">
          <li>
            Every learner is unique, and learning should respect that
            individuality
          </li>
          <li>Clarity matters more than speed or shortcuts</li>
          <li>
            Real progress is something that is observed, understood, and
            continuously improved
          </li>
          <li>
            Teaching should adjust to the learner — not force the learner to
            adjust to the system
          </li>
        </ul>
      </div>

      <div class="purpose__media">
        <button
          v-show="!isPlaying"
          class="purpose__poster"
          type="button"
          aria-label="Play purpose video"
          @click="openVideo"
        >
          <NuxtImg
            :src="posterUrl"
            alt="Purpose video thumbnail"
            quality="85"
            loading="lazy"
          />
          <span class="purpose__play" aria-hidden="true">▶</span>
        </button>

        <div
          v-show="isPlaying"
          class="purpose__player"
          :aria-hidden="!isPlaying"
        >
          <button
            class="purpose__close"
            type="button"
            aria-label="Close video"
            @click="closeVideo"
          >
            ✕
          </button>

          <iframe
            :src="iframeSrc"
            title="Skyinnk purpose video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const isPlaying = ref(false);

const YT_ID = 'dQw4w9WgXcQ';

const posterUrl = 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg';

const iframeSrc = computed(() => {
  return isPlaying.value
    ? `https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0`
    : '';
});

function openVideo() {
  isPlaying.value = true;
}

function closeVideo() {
  isPlaying.value = false;
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isPlaying.value) closeVideo();
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped lang="scss">
@use '../assets/scss/components/home/purpose' as *;
</style>
