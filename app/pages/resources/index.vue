<template>
  <div class="resources-page">
    <div class="container">
      <header class="resources-header">
        <h1>Resources</h1>
      </header>

      <section class="resources-list">
        <div v-if="pending" class="resource-card">Loading resources...</div>
        <div v-else-if="error" class="resource-card">
          Failed to load resources. Please try again.
        </div>
        <div v-else-if="!resources.length" class="resource-card">
          No resources available.
        </div>
        <div v-else class="resources-grid">
          <article
            v-for="resource in resources"
            :key="resource.id"
            class="resource-card"
          >
            <div class="resource-card__content">
              <h3 class="resource-card__title">{{ resource.title }}</h3>
              <p class="resource-card__desc">{{ resource.description }}</p>
              <div
                v-if="resource.pdfLinks.length || resource.pptLinks.length"
                class="resource-card__links"
              >
                <div
                  v-if="resource.pdfLinks.length"
                  class="resource-card__link-group"
                >
                  <span class="resource-card__label">PDF</span>
                  <div class="resource-card__link-list">
                    <a
                      v-for="(link, index) in resource.pdfLinks"
                      :key="`pdf-${resource.id}-${index}`"
                      class="resource-card__link"
                      :href="link"
                    >
                      Download {{ index + 1 }}
                    </a>
                  </div>
                </div>
                <div
                  v-if="resource.pptLinks.length"
                  class="resource-card__link-group"
                >
                  <span class="resource-card__label">PPT</span>
                  <div class="resource-card__link-list">
                    <a
                      v-for="(link, index) in resource.pptLinks"
                      :key="`ppt-${resource.id}-${index}`"
                      class="resource-card__link"
                      :href="link"
                    >
                      Download {{ index + 1 }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

type Resource = {
  id: string;
  title: string;
  description: string;
  PDFUrl?: string | null;
  PPTUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

const { data, pending, error }: any = await useFetch('/api/v1/resourses');

const normalizeLink = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return '';

  if (/^(https?:)?\/\//i.test(trimmed)) {
    return trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
  }

  if (/^[a-z]+:/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const splitLinks = (value: string | null | undefined) => {
  if (!value) return [];
  return value
    .split(',')
    .map((link) => normalizeLink(link))
    .filter(Boolean);
};

const resources = computed<
  (Resource & { pdfLinks: string[]; pptLinks: string[] })[]
>(() =>
  (data.value?.resourses ?? []).map((resource: Resource) => ({
    ...resource,
    pdfLinks: splitLinks(resource.PDFUrl),
    pptLinks: splitLinks(resource.PPTUrl),
  })),
);
</script>

<style lang="scss">
@use '~/assets/scss/components/resources' as *;
</style>
