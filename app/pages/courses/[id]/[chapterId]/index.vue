<template>
  <div class="container">
    <div class="chapter-title-container">
      <h1>{{ chapterTitle }}</h1>
    </div>
    <h1 class="lesson-page-title">Lessons</h1>
    <div class="lesson-layout">
      <div class="lesson-content">
        <p v-if="pending">Loading...</p>
        <p v-else-if="error">Error: {{ error.message }}</p>
        <p v-else-if="!lessons.length">No lessons yet.</p>
        <div v-else class="lesson-list">
          <section
            v-for="lesson in lessons"
            :id="`lesson-${lesson.id}`"
            :key="lesson.id"
            class="lesson-block"
          >
            <h2 :id="`lesson-title-${lesson.id}`" class="lesson-block__title">
              {{ lesson.title }}
            </h2>
            <div
              v-html="getLessonContent(lesson.content)"
              class="lesson-block__content"
            ></div>
            <NuxtLink
              v-if="lesson.contentPPT"
              @click="router.push(`${lesson.contentPPT}`)"
              style="margin-top: 1rem"
              >Download PPT</NuxtLink
            >
            <div
              v-if="lesson.contentVideos"
              v-for="video in getAudience(lesson.contentVideos)"
              :key="video"
              class="videos"
            >
              <video width="400" height="300" controls>
                <source :src="video" type="video/webp" />
              </video>
            </div>
          </section>
        </div>
      </div>
      <aside v-if="lessons.length" class="lesson-nav" aria-label="Lesson links">
        <h2 class="lesson-nav__title">Lessons in this chapter</h2>
        <nav>
          <ul class="lesson-nav__list">
            <li
              v-for="lesson in lessons"
              :key="`nav-${lesson.id}`"
              class="lesson-nav__item"
            >
              <a
                :href="`#lesson-${lesson.id}`"
                @click.prevent="scrollToLessonTitle(lesson.id)"
              >
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
const route = useRoute();
const router = useRouter();
const courseId = computed(() => route.params.id as string);
const chapterId = computed(() => route.params.chapterId as string);

definePageMeta({
  middleware: 'auth',
});

type Lesson = {
  id: string;
  title: string;
  content: string;
  contentPPT: string;
  contentVideos: string;
};

type Chapter = {
  title: string;
};

const { data, pending, error } = useFetch<{
  lessons: Lesson[];
  chapter: Chapter | null;
}>(
  () => `/api/v1/course/chapter/${chapterId.value}?id=${courseId.value}`,
);

const lessons = computed<Lesson[]>(() => data.value?.lessons ?? []);
const chapterTitle = computed(
  () => data.value?.chapter?.title ?? 'Lessons',
);

const getLessonContent = (content: string | null | undefined) => {
  const trimmed = content?.replace(/\r\n/g, '\n').trim() ?? '';

  if (!trimmed) {
    return 'Lesson content will appear here soon.';
  }

  return trimmed;
};

const getAudience = (audience: string | null | undefined) => {
  const items =
    audience
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return items.length ? items : ['null'];
};

const scrollToLessonTitle = (lessonId: string) => {
  const title = document.getElementById(`lesson-title-${lessonId}`);

  if (!title) {
    return;
  }

  requestAnimationFrame(() => {
    const header = document.querySelector('.header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const extraOffset = 0;
    const top =
      title.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      extraOffset;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  });
};
</script>

<style scoped lang="scss">
@use '../../../../assets/scss/config/variables' as *;

.lesson-content {
  margin-top: 1.5rem;
}

.chapter-title-container {
  min-height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lesson-page-title {
  margin: 0.35rem 0 0;
  font-family: $titleFont;
  font-size: 2.2rem;
  color: $grey-900;
}

.lesson-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.lesson-nav {
  position: sticky;
  top: 24px;
  align-self: start;
  justify-self: end;
  display: none;
}

.lesson-nav__title {
  margin: 0 0 12px;
  font-family: $titleFont;
  font-size: 1.3rem;
}

.lesson-nav__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.lesson-list {
  display: grid;
  gap: 24px;
}

.lesson-block {
  padding-bottom: 24px;
  border-bottom: 1px solid $grey-200;
}

.lesson-block:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.lesson-block__title {
  margin: 0 0 12px;
  font-family: $titleFont;
  font-size: 1.8rem;
  color: $grey-900;
}

.lesson-block__content {
  font-family: $tagFont;
  line-height: 2.1;
}

.lesson-block__content :deep(p) {
  margin: 0 0 12px;
}

.lesson-block__content :deep(p:last-child) {
  margin-bottom: 0;
}

.course-media {
  align-self: center;
}

.videos {
  margin-top: 1rem;
}

@media (min-width: $tablet) {
  .lesson-layout {
    grid-template-columns: minmax(0, 1fr) 240px;
  }

  .lesson-nav {
    display: block;
  }

  .lesson-list {
    gap: 32px;
  }

  .course-media {
    align-self: auto;
  }
}
</style>
