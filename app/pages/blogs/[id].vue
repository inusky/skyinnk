<template>
  <div class="blog-detail">
    <div class="container">
      <div class="blog-detail__layout">
        <div v-if="pending" class="blog-detail__state">Loading blog...</div>
        <div v-else-if="error" class="blog-detail__state">
          Failed to load this blog. Please try again.
        </div>
        <div v-else-if="!blog" class="blog-detail__state">Blog not found.</div>
        <article v-else class="blog-detail__article">
          <h1 class="blog-detail__title">{{ blog.title }}</h1>
          <p class="blog-detail__subtitle">{{ blog.description }}</p>

          <div class="blog-detail__meta">
            <span>Last Updated {{ formatDate(blog.updatedAt) }}</span>
          </div>

          <div v-if="blog.image" class="blog-detail__media">
            <NuxtImg
              :src="blog.image"
              :alt="blog.title"
              class="blog-detail__image"
              loading="lazy"
            />
          </div>

          <div class="blog-detail__content">
            <p v-html="blog.content"></p>
          </div>
        </article>

        <aside class="blog-detail__sidebar">
          <h2 class="blog-detail__sidebar-title">Recent stories</h2>
          <div v-if="recentPending" class="blog-card blog-card--compact">
            Loading recent stories...
          </div>
          <div v-else-if="recentError" class="blog-card blog-card--compact">
            Failed to load recent stories.
          </div>
          <div
            v-else-if="!recentBlogs.length"
            class="blog-card blog-card--compact"
          >
            No recent stories yet.
          </div>
          <div v-else class="blog-detail__sidebar-list">
            <NuxtLink
              v-for="blog in recentBlogs"
              :key="`detail-recent-${blog.id}`"
              class="recent-card"
              :to="`/blogs/${blog.id}`"
            >
              <h3 class="recent-card__title">{{ blog.title }}</h3>
              <p class="recent-card__date">
                Last Updated {{ formatShortDate(blog.updatedAt) }}
              </p>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { data, pending, error }: any = await useFetch(
  `/api/v1/blogs/${route.params.id}`,
);
const {
  data: recentData,
  pending: recentPending,
  error: recentError,
}: any = await useFetch('/api/v1/blogs/few');

const blog = computed(() => data.value?.blog ?? null);
const recentBlogs = computed(() => recentData.value?.blogs ?? []);

const getInitial = (title?: string) => {
  if (!title) return 'S';
  return title.trim().charAt(0).toUpperCase();
};

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return 'Recently';
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Recently';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const formatShortDate = (value: string | Date | null | undefined) => {
  if (!value) return 'Recently';
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Recently';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
};
</script>

<style lang="scss">
@use '~/assets/scss/components/blog-detail' as *;
</style>
