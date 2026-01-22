<template>
  <div class="container">
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!course">Course not found.</p>

    <div v-else>
      <div class="course-hero">
        <div class="course-details course-details--hero">
          <h1 class="course-title">{{ course.title }}</h1>
          <p class="course-description">{{ course.description }}</p>
          <NuxtLink class="course-audience__toggle" to="/courses">
            Back to courses
          </NuxtLink>
        </div>
        <div class="course-media course-details--hero">
          <NuxtImg :src="course.image || '/hero-illustration.svg'" :alt="course.title" loading="lazy" quality="80" />
          <div class="course-media__meta">
            <span>Last Updated {{ formatDate(course.updatedAt) }}</span>
            <span>{{ course.lang || 'Multi-language' }}</span>
          </div>
        </div>
      </div>
      <div class="course-overview">
        <div class="course-insights">
          <div class="course-audience">
            <h3>What you will learn</h3>
            <ul class="course-audience__list">
              <li v-for="(item, index) in getList(course.learning, defaultLearning)"
                :key="`${course.id}-learn-${index}`">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <section class="course-content">
      <div class="course-content__header">
        <h3>Course content</h3>
      </div>
      <div class="course-content__body">
        <div v-if="chaptersPending" class="course-content__state">
          Loading content...
        </div>
        <div v-else-if="chaptersError" class="course-content__state">
          Unable to load content. Please try again in a moment.
        </div>
        <div v-else-if="!chapters.length" class="course-content__state">
          No content yet. Check back soon for new releases.
        </div>
        <div v-else class="course-content__sections">
          <details v-for="(chapter, index) in chapters" :key="chapter.id" class="course-section" :open="index === 0">
            <summary class="course-section__summary">
              <span class="course-section__chevron" aria-hidden="true"></span>
              <span class="course-section__title">{{ chapter.title }}</span>
            </summary>
            <div class="course-section__body">
              <NuxtLink :to="`/courses/${courseId}/${chapter.id}`" class="course-section__more">
                Learn more
              </NuxtLink>
            </div>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  lang: string;
  whoFor: string;
  learning: string;
  updatedAt: string;
};

type Chapter = {
  id: string;
  title: string;
  updatedAt: string;
};

type Lesson = {
  id: string;
  title: string;
  updatedAt: string;
};

const route = useRoute();
const courseId = computed(() => route.params.id as string);

const { data, pending, error } = useFetch<{ course: Course | null }>(
  () => `/api/v1/course/${courseId.value}`,
);

const course = computed(() => data.value?.course ?? null);

const {
  data: chaptersData,
  pending: chaptersPending,
  error: chaptersError,
} = useFetch<{ chapters: Chapter[] }>(() => `/api/v1/course/chapter?id=${courseId.value}`);

const chapters = computed<Chapter[]>(() => chaptersData.value?.chapters ?? []);
const defaultLearning = 'New skills you can apply immediately.';

const getList = (value: string | null | undefined, fallback: string) => {
  const items =
    value
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return items.length ? items : [fallback];
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Recently';
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Recently';
  }

  return format(parsed, 'd MMM, yyyy');
};
</script>

<style scoped lang="scss">
@use '../../../assets/scss/components/courses' as *;
</style>
