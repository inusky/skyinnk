<template>
  <div class="container">
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!course">Course not found.</p>

    <div v-else class="card course-overview">
      <div class="card-inner">
        <div class="course-hero">
          <div class="course-details">
            <h1 class="course-title">{{ course.title }}</h1>
            <p class="course-description">{{ course.description }}</p>
          </div>
          <div class="course-media">
            <NuxtImg :src="course.image || '/hero-illustration.svg'" :alt="course.title" loading="lazy" quality="80" />
            <div class="course-media__meta">
              <span>Last Updated {{ formatDate(course.updatedAt) }}</span>
              <span>{{ course.lang || 'Multi-language' }}</span>
            </div>
          </div>
        </div>

        <div class="course-insights">
          <div class="course-audience">
            <h3>Who this course is for</h3>
            <ul class="course-audience__list">
              <li v-for="(item, index) in getList(course.whoFor, defaultAudience)" :key="`${course.id}-who-${index}`">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="course-audience">
            <h3>What you will learn</h3>
            <ul class="course-audience__list">
              <li v-for="(item, index) in getList(course.learning, defaultLearning)"
                :key="`${course.id}-learn-${index}`">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="course-actions">
            <NuxtLink class="course-audience__toggle" to="/courses">
              Back to courses
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h3>Chapters</h3>
      <div class="list">
        <article v-if="chaptersPending" class="card course-overview">
          <div class="card-inner">
            <div class="course-details">
              <h2 class="course-title">Loading chapters...</h2>
              <p class="course-description">Gathering the outline.</p>
            </div>
          </div>
        </article>
        <article v-else-if="chaptersError" class="card course-overview">
          <div class="card-inner">
            <div class="course-details">
              <h2 class="course-title">Unable to load chapters.</h2>
              <p class="course-description">Please try again in a moment.</p>
            </div>
          </div>
        </article>
        <article v-else-if="!chapters.length" class="card course-overview">
          <div class="card-inner">
            <div class="course-details">
              <h2 class="course-title">No chapters yet.</h2>
              <p class="course-description">Check back soon for new releases.</p>
            </div>
          </div>
        </article>
        <template v-else>
          <NuxtLink v-for="(chapter) in chapters" :key="chapter.id" :to="{
            path: `/courses/${courseId}/${chapter.id}`,
            query: { title: chapter.title },
          }" class="card course-overview">
            <div class="card-inner">
              <div class="course-hero">
                <div class="course-details">
                  <h2 class="course-title">{{ chapter.title }}</h2>
                  <p class="course-description">Last Updated {{ formatDate(chapter.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>
      </div>
    </div>
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
}: any = useFetch(() => `/api/v1/course/chapter?id=${courseId.value}`);

const chapters = computed(() => chaptersData.value?.chapters ?? []);

const defaultAudience = 'Built for curious learners.';
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
@use '../../../assets/scss/config/variables' as *;

.list {
  .course-overview:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-3;
  }
}
</style>
