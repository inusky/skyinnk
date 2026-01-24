<template>
  <div class="container">
    <section class="hero-container">
      <NuxtImg :src="r2Url + '?key=hero-image-on-top.jpg'" alt="Students" quality="80" />
      <div class="intro">
        <SignedOut>
          <div class="hero-text">
            <h1>Learning that inspires thinking, expression, and purpose.</h1>
            <p>
              A space where curiosity is explored deeply, ideas are understood clearly, and learning feels meaningful.
            </p>
            <p>
              Nurturing curiosity with clarity and confidence for every learner.
            </p>
          </div>
          <div class="cta">
            <button @click="router.push('auth/sign-up')">Join for free</button>
            <p class="log-in">
              <span>Already have an account?</span>
              <NuxtLink class="log-in__link" to="/auth/sign-in">
                Log in
              </NuxtLink>
            </p>
          </div>
        </SignedOut>
        <SignedIn>
          <div class="hero-text">
            <h1>Learning that inspires thinking, expression, and purpose.</h1>
            <p>
              A space where curiosity is explored deeply, ideas are understood clearly, and learning feels meaningful.
            </p>
            <p>
              Nurturing curiosity with clarity and confidence for every learner.
            </p>
          </div>
        </SignedIn>
      </div>
    </section>

    <section class="course-rail" aria-labelledby="featured-courses">
      <div class="course-rail__inner">
        <div class="course-rail__promo">
          <p id="featured-courses" class="course-rail__eyebrow">
            Hot new releases
          </p>
          <NuxtLink class="course-rail__cta" to="/courses">
            Explore courses <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="course-rail__content">
          <div v-if="pending" class="course-rail__state">
            Loading courses...
          </div>
          <div v-else-if="error" class="course-rail__state is-error">
            We couldn't load courses right now. Please try again soon.
          </div>
          <div v-else-if="!courses.length" class="course-rail__state">
            No courses found.
          </div>
          <div v-else class="course-rail__cards">
            <NuxtLink v-for="(course, index) in courses" :key="course.id" class="course-card"
              :data-variant="String(((index as number) % 3) + 1)" to="/courses">
              <div class="course-card__media">
                <NuxtImg v-if="course.image" :src="course.image" :alt="course.title" loading="lazy" quality="80" />
              </div>
              <div class="course-card__body">
                <p class="course-card__kicker">
                  Course
                </p>
                <h3 class="course-card__title">{{ course.title }}</h3>
                <p class="course-card__desc">{{ course.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="why" aria-labelledby="why-skyinnk">
      <div class="why__header">
        <h2 id="why-skyinnk">Why Skyinnk</h2>
      </div>
      <div class="why__grid">
        <div class="why__card">
          <div class="why__icon is-rose" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M18 40l10-10 8 8 10-14" />
              <path d="M12 52h40" />
              <path d="M14 12h36v36H14z" />
            </svg>
          </div>
          <h3>Guided practice</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
        <div class="why__card">
          <div class="why__icon is-mint" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M20 44l24-24" />
              <path d="M22 22h20v20H22z" />
              <path d="M12 52h40" />
            </svg>
          </div>
          <h3>Learners' feedback</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
        <div class="why__card">
          <div class="why__icon is-peach" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M16 22h32v20H16z" />
              <path d="M20 22v-6h24v6" />
              <path d="M24 46h16" />
            </svg>
          </div>
          <h3>Curated paths</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
      </div>
    </section>

    <section class="faq" aria-labelledby="faq-title">
      <div class="faq__header">
        <h2 id="faq-title">Frequently asked questions</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </div>
      <div class="faq__list">
        <details class="faq__item">
          <summary>What is Skyinnk?</summary>
          <p class="faq__answer">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, rem omnis. Repellendus facilis,
            blanditiis odio illo velit error exercitationem omnis eveniet maiores aliquam quaerat deserunt veniam
            commodi, ducimus amet saepe?
          </p>
        </details>
        <details class="faq__item">
          <summary>How long are the lessons?</summary>
          <p class="faq__answer">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex aperiam cum blanditiis tempora veniam
            accusantium, accusamus aspernatur reprehenderit facilis atque rerum neque id quae! Quidem quo temporibus
            esse ea adipisci!
          </p>
        </details>
        <details class="faq__item">
          <summary>Do I need experience?</summary>
          <p class="faq__answer">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam vel hic illo fugit officia velit eum
            architecto qui at voluptatibus veritatis sapiente consectetur eaque, autem eligendi possimus ullam, atque
            itaque?
          </p>
        </details>
        <details class="faq__item">
          <summary>Can I learn at my own pace?</summary>
          <p class="faq__answer">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam cupiditate corporis assumenda atque possimus
            natus quae, suscipit id quam. Enim perferendis corrupti laborum eius tempora corporis suscipit voluptas
            magnam? Ad?
          </p>
        </details>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const r2Url = ref('https://skyinnk-r2.skyinnk-api.workers.dev');

const { data, pending, error }: any = await useFetch('/api/v1/courses/few');

const courses = computed(() => data.value?.courses ?? []);
</script>

<style scoped lang="scss">
@use '../assets/scss/components/home' as *;
</style>
