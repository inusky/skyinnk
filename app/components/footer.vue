<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__idea">
        <p>
          Our mission is to provide a free, world-class education to anyone,
          anywhere.
          <br />
          - Skyinnk Team
        </p>
      </div>
      <div class="footer__links">
        <div class="footer__column">
          <p class="footer__title">About</p>
          <div class="footer__list">
            <NuxtLink class="footer__link" to="/about">About Us</NuxtLink>
          </div>
        </div>
        <div class="footer__column">
          <p class="footer__title">Explore</p>
          <div class="footer__list">
            <NuxtLink class="footer__link" to="/courses">Courses</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>&copy; 2026 Skyinnk. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '../assets/scss/components/footer' as *;
</style>
