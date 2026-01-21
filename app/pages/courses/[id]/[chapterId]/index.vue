<template>
  <div class="container">
    <h1>Lessons</h1>
    <div class="list">
      <p v-if="pending">Loading...</p>
      <p v-else-if="error">Error: {{ error.message }}</p>
      <p v-else-if="!lessons.length">No lessons yet.</p>
      <NuxtLink v-else v-for="(lesson) in lessons" :key="lesson.id" :to="{
        path: `/courses/${courseId}/${chapterId}/${lesson.id}`,
        query: chapterTitle ? { chapterTitle } : undefined,
      }" class="card course-overview">
        <div class="card-inner">
          <div class="course-details">
            <h2 class="course-title">{{ lesson.title }}</h2>
            <p class="course-description">Last Updated {{ formatDate(lesson.updatedAt) }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

const route = useRoute();
const courseId = computed(() => route.params.id as string);
const chapterId = computed(() => route.params.chapterId as string);
const chapterTitle = computed(() =>
  typeof route.query.title === 'string' ? route.query.title.trim() : '',
);

const { data, pending, error }: any = useFetch(
  () => `/api/v1/course/chapter/${chapterId.value}?id=${courseId.value}`,
);

const lessons = computed(() => data.value?.lessons ?? []);

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
@use '../../../../assets/scss/components/courses' as *;
</style>
