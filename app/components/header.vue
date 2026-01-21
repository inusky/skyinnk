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
      <button class="nav-toggle" type="button" aria-label="Toggle navigation"
        :aria-expanded="isMenuOpen ? 'true' : 'false'" aria-controls="header-menu" @click="isMenuOpen = !isMenuOpen">
        <span class="nav-toggle__bar"></span>
      </button>
    </div>
    <div id="header-menu" class="header__links" :class="{ 'is-open': isMenuOpen }">
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
      </SignedIn>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../assets/scss/components/header' as *;
</style>

<script setup lang="ts">
const isMenuOpen = ref(false);
</script>
