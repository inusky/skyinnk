<template>
  <div class="container">
    <h1>Lessons</h1>
    <div class="lesson-content">
      <p v-if="pending">Loading...</p>
      <p v-else-if="error">Error: {{ error.message }}</p>
      <p v-else-if="!lessons.length">No lessons yet.</p>
      <div v-else class="lesson-accordion">
        <details v-for="(lesson, index) in lessons" :key="lesson.id" class="lesson-item"
          :open="index === 0">
          <summary class="lesson-item__summary">
            <span class="lesson-item__chevron" aria-hidden="true"></span>
            <span class="lesson-item__title">{{ lesson.title }}</span>
          </summary>
          <div class="lesson-item__body">
            <button type="button" class="lesson-item__link" @click="toggleLesson(lesson.id)">
              Learn more
            </button>
            <div v-if="expandedLessons[lesson.id]" class="lesson-item__content">
              <MDC v-for="(paragraph, index) in getLessonParagraphs(lesson.content)"
                :key="`lesson-${lesson.id}-${index}`" :value="paragraph" class="lesson-item__paragraph" />
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Lesson = {
  id: string;
  title: string;
  content: string;
};

const route = useRoute();
const courseId = computed(() => route.params.id as string);
const chapterId = computed(() => route.params.chapterId as string);

const { data, pending, error } = useFetch<{ lessons: Lesson[] }>(
  () => `/api/v1/course/chapter/${chapterId.value}?id=${courseId.value}`,
);

const lessons = computed<Lesson[]>(() => data.value?.lessons ?? []);
const expandedLessons = ref<Record<string, boolean>>({});

const toggleLesson = (lessonId: string) => {
  expandedLessons.value = {
    ...expandedLessons.value,
    [lessonId]: !expandedLessons.value[lessonId],
  };
};

const getLessonParagraphs = (content: string | null | undefined) => {
  const trimmed = content?.replace(/\r\n/g, '\n').trim() ?? '';

  if (!trimmed) {
    return ['Lesson content will appear here soon.'];
  }

  const parts = trimmed
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return parts.length ? parts : ['Lesson content will appear here soon.'];
};
</script>

<style scoped lang="scss">
@use '../../../../assets/scss/config/variables' as *;

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 5px;
  background: $blue-700;
  color: $light;
  font-family: $contentFont;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: #fff;
  }
}
</style>
