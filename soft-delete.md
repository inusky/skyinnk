### delete.post.ts

```ts
import { clerkClient } from '@clerk/nuxt/server';
import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const { userId, isAuthenticated } = event.context.auth();
    if (!isAuthenticated || !userId) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const existing = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { deletedAt: true },
    });

    if (existing?.deletedAt) {
      return { ok: true, alreadyDeleted: true };
    }

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { deletedAt: new Date() },
      create: { clerkId: userId, deletedAt: new Date() },
    });

    try {
      await clerkClient(event).users.deleteUser(userId);
    } catch (err: any) {
      if (err?.status !== 404) {
        throw err;
      }
    }

    return { ok: true, deleted: true };
  } catch (err: any) {
    console.error('DELETE FAILED:', err);
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.message || 'Delete failed',
      data: { clerk: err?.errors ?? err },
    });
  }
});
```

### header.vue

```vue
<template>
  <header class="header">
    <div class="title-nav">
      <NuxtLink to="/">
        <div class="title-sel">
          <div class="logo">
            <NuxtImg src="/favicon.png" alt="Logo" quality="10" />
          </div>
          <div class="sel">
            <h1>Skyinnk</h1>
            <p>Expressive learning</p>
          </div>
        </div>
      </NuxtLink>

      <button
        class="nav-toggle"
        type="button"
        aria-label="Toggle navigation"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-controls="header-menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="nav-toggle__bar"></span>
      </button>
    </div>

    <div
      id="header-menu"
      class="header__links"
      :class="{ 'is-open': isMenuOpen }"
    >
      <nav class="nav-links">
        <NuxtLink to="/courses" class="courses">Courses</NuxtLink>
        <NuxtLink to="/about" class="about">About Us</NuxtLink>
        <NuxtLink to="/blogs" class="blogs">Blogs</NuxtLink>
      </nav>
    </div>

    <div class="header__user">
      <SignedOut>
        <nav class="user-links user-links--auth">
          <NuxtLink to="/auth/sign-in">Sign in</NuxtLink>
          <NuxtLink to="/auth/sign-up">Sign up</NuxtLink>
        </nav>
      </SignedOut>

      <SignedIn>
        <UserButton />

        <button
          class="btn--destructive"
          style="margin-left: 1rem"
          @click="openConfirm"
        >
          Delete account
        </button>
      </SignedIn>
    </div>
  </header>

  <teleport to="body">
    <div v-if="confirmOpen" class="modal" @click.self="closeConfirm">
      <div class="modal__panel">
        <div class="modal__body">
          <h3 class="modal__title">Delete account?</h3>
          <p class="modal__text">
            This will permanently delete your account. This action cannot be
            undone.
          </p>

          <div class="modal__actions">
            <button class="btn" @click="closeConfirm">Cancel</button>

            <button
              class="btn--destructive"
              :disabled="!canDelete"
              @click="confirmDelete"
            >
              {{ canDelete ? 'Delete account' : `Delete in ${seconds}s…` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';

const isMenuOpen = ref(false);
const { signOut } = useAuth();

const confirmOpen = ref(false);
const seconds = ref(2);
let timer: number | null = null;

const canDelete = computed(() => seconds.value <= 0);

function openConfirm() {
  confirmOpen.value = true;
  seconds.value = 2;

  if (timer) clearInterval(timer);
  timer = window.setInterval(() => {
    seconds.value -= 1;
    if (seconds.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}

function closeConfirm() {
  confirmOpen.value = false;
  if (timer) clearInterval(timer);
  timer = null;
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

async function confirmDelete() {
  if (!canDelete.value) return;

  try {
    await $fetch('/api/v1/auth/delete', { method: 'POST' });
    await signOut.value({ redirectUrl: '/' });
  } catch (e) {
    console.error(e);
  } finally {
    closeConfirm();
  }
}
</script>

<style scoped lang="scss">
@use '../assets/scss/components/header' as *;

.btn--destructive {
  background-color: var(--danger-bg, #dc2626);
  color: #fff;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 9999;
}

.modal__panel {
  width: min(520px, 100%);
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal__body {
  padding: 28px;
}

.modal__title {
  margin: 0 0 8px;
  font-size: 1.5rem;
  color: #111;
}

.modal__text {
  margin: 0 0 20px;
  color: #555;
  line-height: 1.5;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn--destructive {
  background-color: var(--danger-bg, #dc2626);
  color: #fff;
}

.btn--destructive[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
```

### schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  clerkId   String    @unique
  email     String?
  name      String?
  imageUrl  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([email])
  @@index([createdAt])
}

model Course {
  id          String    @id @default(cuid())
  title       String    @unique
  description String
  image       String?
  lang        String
  whoFor      String
  learning    String
  chapters    Chapter[]
  lessons     Lesson[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([title])
  @@index([lang])
}

model Chapter {
  id        String   @id @default(cuid())
  title     String   @unique
  lessons   Lesson[]
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId])
}

model Lesson {
  id        String   @id @default(cuid())
  title     String   @unique
  content   String
  contentPPT String?
  contentVideos String?
  chapter   Chapter  @relation(fields: [chapterId], references: [id])
  chapterId String
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId])
  @@index([chapterId])
}
```
