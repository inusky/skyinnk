<template>
  <div class="container">
    <h1>Your courses</h1>
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <div v-else-if="courses.length">
      <div class="list">
        <div class="card">
          <div v-for="course in courses" :key="course.id">
            <div class="card-inner">
              <div class="course-hero">
                <div class="course-details">
                  <h2 class="course-title">{{ course.title }}</h2>
                  <p class="course-description">{{ course.description }}</p>
                </div>
                <div class="course-media">
                  <NuxtImg :src="course.image" :alt="course.title" loading="lazy" quality="80" />
                  <div class="course-media__meta">
                    <span>Last updated {{ formatDate(course.updatedAt) }}</span>
                    <span>{{ course.lang || 'Multi-language' }}</span>
                  </div>
                </div>
              </div>
              <div class="course-insights">
                <div class="course-audience">
                  <h3>Who this course is for</h3>
                  <ul class="course-audience__list">
                    <li v-for="(item, index) in getAudience(course.whoFor)" :key="`${course.id}-${index}`">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="course-actions">
                  <button class="course-actions" @click="router.push(`/courses/${course.id}`)">
                    View course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else>No courses found.</p>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
const router = useRouter();
const { data, pending, error }: any = useFetch('/api/v1/courses');

const courses = computed(() => data.value?.courses ?? []);

const getAudience = (audience: string | null | undefined) => {
  const items =
    audience
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return items.length ? items : ['Built for curious learners.'];
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

<style lang="scss">
@use './../../assets/scss/components/courses' as *;
</style>
