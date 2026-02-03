<template>
  <div class="sign-in">
    <SignIn />
  </div>
</template>

<style scoped lang="scss">
.sign-in {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 6rem);
  padding: clamp(2rem, 5vw, 4rem) 1.5rem;
}

.sign-in :deep(.cl-rootBox) {
  width: 100%;
  display: flex;
  justify-content: center;
}

.sign-in :deep(.cl-card) {
  width: 100%;
  padding: clamp(1.4rem, 3vw, 2.2rem);
}

.sign-in :deep(.cl-cardBox) {
  width: min(90vw, 360px);
}
</style>
