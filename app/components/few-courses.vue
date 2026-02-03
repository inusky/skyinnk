<template>
  <section class="course-rail container" aria-labelledby="featured-courses">
    <div class="course-rail__inner">
      <div class="course-rail__promo">
        <p id="featured-courses" class="course-rail__eyebrow">
          Hot new releases
        </p>
        <NuxtLink class="course-rail__cta" to="/courses">
          Explore courses <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
      <div class="course-rail__content">
        <div v-if="pending" class="course-rail__state">Loading courses...</div>
        <div v-else-if="error" class="course-rail__state is-error">
          We couldn't load courses right now. Please try again soon.
        </div>
        <div v-else-if="!courses.length" class="course-rail__state">
          No courses found.
        </div>
        <div v-else class="course-rail__cards">
          <NuxtLink
            v-for="(course, index) in courses"
            :key="course.id"
            class="course-card"
            :data-variant="String(((index as number) % 3) + 1)"
            to="/courses"
          >
            <div class="course-card__media">
              <NuxtImg
                v-if="course.image"
                :src="course.image"
                :alt="course.title"
                loading="lazy"
                quality="75"
                format="webp"
                decoding="async"
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
              />
            </div>
            <div class="course-card__body">
              <p class="course-card__kicker">Course</p>
              <h3 class="course-card__title">{{ course.title }}</h3>
              <p class="course-card__desc">{{ course.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data, pending, error }: any = await useFetch('/api/v1/courses/few');

const courses = computed(() => data.value?.courses ?? []);
</script>

<style scoped lang="scss">
@use '../assets/scss/components/home/few-courses' as *;
</style>
