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
          <NuxtLink
            v-if="chapters[0]"
            class="course-audience__toggle"
            :to="`/courses/${course.id}/${chapters[0]?.id}`"
          >
            Start learning
          </NuxtLink>
        </div>
        <div class="course-media course-details--hero">
          <NuxtImg
            :src="course.image || '/hero-illustration.svg'"
            :alt="course.title"
            loading="lazy"
            quality="80"
          />
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
              <li
                v-for="(item, index) in getList(
                  course.learning,
                  defaultLearning,
                )"
                :key="`${course.id}-learn-${index}`"
              >
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
          <details
            v-for="chapter in chapters"
            :key="chapter.id"
            class="course-section"
            @toggle="onChapterToggle(chapter.id, $event)"
          >
            <summary class="course-section__summary">
              <span class="course-section__chevron" aria-hidden="true"></span>
              <span class="course-section__title">{{ chapter.title }}</span>
            </summary>
            <div class="course-section__body">
              <p
                v-if="lessonsPending[chapter.id]"
                class="course-section__state"
              >
                Loading lessons...
              </p>
              <p
                v-else-if="lessonsError[chapter.id]"
                class="course-section__state"
              >
                {{ lessonsError[chapter.id] }}
              </p>
              <p
                v-else-if="lessonsByChapter[chapter.id]?.length === 0"
                class="course-section__state"
              >
                No lessons yet.
              </p>
              <ul v-else class="course-section__lessons">
                <li
                  v-for="lesson in lessonsByChapter[chapter.id] ?? []"
                  :key="lesson.id"
                >
                  <NuxtLink
                    :to="`/courses/${courseId}/${chapter.id}`"
                    class="course-section__lesson"
                  >
                    <span class="course-section__lesson-title">{{
                      lesson.title
                    }}</span>
                  </NuxtLink>
                </li>
              </ul>
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
} = useFetch<{ chapters: Chapter[] }>(
  () => `/api/v1/course/chapter?id=${courseId.value}`,
);

const chapters = computed<Chapter[]>(() => chaptersData.value?.chapters ?? []);
const defaultLearning = 'New skills you can apply immediately.';
const lessonsByChapter = ref<Record<string, Lesson[]>>({});
const lessonsPending = ref<Record<string, boolean>>({});
const lessonsError = ref<Record<string, string>>({});

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

const ensureLessons = (chapterId: string) => {
  if (lessonsByChapter.value[chapterId] || lessonsPending.value[chapterId]) {
    return;
  }

  lessonsPending.value = { ...lessonsPending.value, [chapterId]: true };
  lessonsError.value = { ...lessonsError.value, [chapterId]: '' };

  const { data, pending, error } = useFetch<{ lessons: Lesson[] }>(
    `/api/v1/course/chapter/${chapterId}?id=${courseId.value}`,
    { key: `lessons-${courseId.value}-${chapterId}` },
  );

  watch(
    pending,
    (value) => {
      lessonsPending.value = { ...lessonsPending.value, [chapterId]: value };
    },
    { immediate: true },
  );

  watch(
    data,
    (value) => {
      if (!value) return;
      lessonsByChapter.value = {
        ...lessonsByChapter.value,
        [chapterId]: value.lessons ?? [],
      };
    },
    { immediate: true },
  );

  watch(
    error,
    (value) => {
      if (!value) return;
      lessonsError.value = {
        ...lessonsError.value,
        [chapterId]: 'Unable to load lessons. Please try again in a moment.',
      };
    },
    { immediate: true },
  );
};

const onChapterToggle = (chapterId: string, event: Event) => {
  const target = event.target as HTMLDetailsElement | null;
  if (target?.open) {
    void ensureLessons(chapterId);
  }
};

watch(
  () => chapters.value,
  (value: any) => {
    if (value.length) {
      ensureLessons(value[0].id);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@use '../../../assets/scss/components/courses' as *;
</style>
