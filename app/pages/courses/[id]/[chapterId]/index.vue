<template>
  <div class="container">
    <h1>Lessons</h1>
    <div class="lesson-layout">
      <div class="lesson-content">
        <p v-if="pending">Loading...</p>
        <p v-else-if="error">Error: {{ error.message }}</p>
        <p v-else-if="!lessons.length">No lessons yet.</p>
        <div v-else class="lesson-accordion">
          <details v-for="(lesson, index) in lessons" :id="`lesson-${lesson.id}`" :key="lesson.id"
            class="lesson-item" :open="index === 0">
            <summary class="lesson-item__summary">
              <span class="lesson-item__chevron" aria-hidden="true"></span>
              <span :id="`lesson-title-${lesson.id}`" class="lesson-item__title">{{ lesson.title }}</span>
            </summary>
            <div class="lesson-item__body">
              <button :id="`lesson-link-${lesson.id}`" type="button" class="lesson-item__link"
                @click="toggleLesson(lesson.id)">
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
      <aside v-if="lessons.length" class="lesson-nav" aria-label="Lesson links">
        <h2 class="lesson-nav__title">Lessons in this chapter</h2>
        <nav>
          <ul class="lesson-nav__list">
            <li v-for="lesson in lessons" :key="`nav-${lesson.id}`" class="lesson-nav__item">
              <a class="lesson-nav__link" :href="`#lesson-link-${lesson.id}`"
                @click.prevent="scrollToLesson(lesson.id)">
                {{ lesson.title }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

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

const scrollToLesson = (lessonId: string) => {
  const title = document.getElementById(`lesson-title-${lessonId}`);
  const link = document.getElementById(`lesson-link-${lessonId}`);
  const target = title ?? link;

  if (!target) {
    return;
  }

  const details = target.closest('details') as HTMLDetailsElement | null;
  if (details) {
    details.open = true;
  }

  requestAnimationFrame(() => {
    const header = document.querySelector('.header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const extraOffset = target === title ? 22 : 6;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'auto' });
  });
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

.lesson-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 24px;
  align-items: start;
}

.lesson-nav {
  position: sticky;
  top: 24px;
  align-self: start;
  justify-self: end;
}

.lesson-nav__title {
  margin: 0 0 12px;
  font-family: $titleFont;
  font-size: 1.2rem;
}

.lesson-nav__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.lesson-nav__link {
  color: $black;
  text-decoration: none;
  font-family: $contentFont;
  transition: none;

  &:hover {
    color: #0000ff;
  }
}

@media (max-width: 960px) {
  .lesson-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .lesson-nav {
    display: none;
  }
}
</style>
