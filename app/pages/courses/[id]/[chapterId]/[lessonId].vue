<template>
  <div class="container">
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!lesson">Lesson not found.</p>

    <article v-else class="card course-overview">
      <div class="card-inner">
        <div class="course-hero">
          <div class="course-details">
            <p v-if="chapterLabel" class="course-description" style="font-style: italic;">{{ chapterLabel }}</p>
            <h1 class="course-title">{{ lesson.title }}</h1>
            <p class="course-description">Last Updated {{ formatDate(lesson.updatedAt) }}</p>
          </div>
        </div>

        <div class="course-actions">
          <NuxtLink class="course-audience__toggle" :to="{
            path: `/courses/${courseId}/${chapterId}`,
          }">
            Back to lessons
          </NuxtLink>
        </div>
      </div>
    </article>

    <article v-if="lesson" class="lesson-body">
      <div class="lesson-content">
        <MDC v-for="(paragraph, index) in lessonParagraphs" :key="`paragraph-${index}`" :value="paragraph"
          class="course-description"></MDC>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
definePageMeta({
  middleware: 'auth'
});

type Lesson = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

const route = useRoute();
const courseId = computed(() => route.params.id as string);
const chapterId = computed(() => route.params.chapterId as string);
const lessonId = computed(() => route.params.lessonId as string);

const { data, pending, error } = useFetch<{ lessons: Lesson[] }>(
  () => `/api/v1/course/chapter/lesson/${lessonId.value}?courseId=${courseId.value}&chapterId=${chapterId.value}`,
);

const lesson = computed(() => data.value?.lessons?.[0] ?? null);

const chapterLabel = computed(() => {
  const title = route.query.chapterTitle;
  if (typeof title !== 'string') return '';
  const trimmed = title.trim();
  return trimmed ? `Chapter: ${trimmed}` : '';
});

const lessonParagraphs = computed(() => {
  const content = lesson.value?.content ?? '';
  const trimmed = content.replace(/\r\n/g, '\n').trim();

  if (!trimmed) {
    return ['Lesson content will appear here soon.'];
  }

  const parts = trimmed
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return parts.length ? parts : ['Lesson content will appear here soon.'];
});

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

.lesson-content {
  display: grid;
  gap: 16px;
}

.lesson-body {
  margin-top: 24px;
}
</style>
