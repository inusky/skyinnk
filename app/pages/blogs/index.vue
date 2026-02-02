<template>
  <div class="blogs-page">
    <div class="container">
      <header class="blogs-header">
        <h1>Blogs</h1>
      </header>

      <section class="blogs-layout">
        <div class="blogs-list">
          <div v-if="pending" class="blog-card">Loading blogs...</div>
          <div v-else-if="error" class="blog-card">
            Failed to load blogs. Please try again.
          </div>
          <div v-else-if="!blogs.length" class="blog-card">
            No blogs available.
          </div>
          <div v-else class="blogs-list__grid">
            <NuxtLink
              v-for="blog in blogs"
              :key="blog.id"
              class="blog-card blog-card--compact blog-card--link"
              :to="`/blogs/${blog.id}`"
            >
              <div class="blog-card__content">
                <h3 class="blog-card__title">{{ blog.title }}</h3>
                <p class="blog-card__excerpt">{{ blog.description }}</p>
                <div class="blog-card__footer">
                  <div class="blog-card__stats">
                    <span class="blog-card__stat">
                      Last Updated {{ formatDate(blog.updatedAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="blog-card__media"
                aria-hidden="true"
                v-if="blog?.image"
              >
                <NuxtImg
                  class="blog-card__image"
                  :src="blog?.image"
                  alt=""
                  loading="lazy"
                />
              </div>
            </NuxtLink>
          </div>
        </div>

        <aside class="blogs-sidebar">
          <h2 class="blogs-sidebar__title">Recent stories</h2>
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
          <div v-else class="blogs-sidebar__list">
            <NuxtLink
              v-for="blog in recentBlogs"
              :key="`recent-${blog.id}`"
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
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pending, error }: any = await useFetch('/api/v1/blogs');
const {
  data: recentData,
  pending: recentPending,
  error: recentError,
}: any = await useFetch('/api/v1/blogs/few');

const blogs = computed(() => data.value?.blogs ?? []);
const recentBlogs = computed(() => recentData.value?.blogs ?? []);

const formatDate = (value: string | Date | null | undefined) => {
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
@use '~/assets/scss/components/blogs' as *;
</style>
