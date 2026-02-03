<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
});

const route = useRoute();
const returnTo = (route.query.returnTo as string | undefined) || '/';

const { me, pending: mePending } = useAuthState();

const syncing = ref(false);
const syncError = ref<string | null>(null);

const syncIfAuthenticated = async () => {
  if (!me.value?.authenticated || syncing.value) return;
  syncing.value = true;
  syncError.value = null;
  try {
    await $fetch('/api/v1/auth/sync', { method: 'POST' });
  } catch (err: any) {
    syncError.value = err?.message || 'Sync failed';
  } finally {
    syncing.value = false;
  }
};

watch(
  () => me.value?.authenticated,
  () => {
    void syncIfAuthenticated();
  },
  { immediate: true },
);

const goToLogin = () =>
  navigateTo(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    external: true,
  });
</script>

<template>
  <section class="auth auth--in">
    <div class="auth__bg" />
    <div class="auth__grid">
      <div class="auth__copy">
        <p class="auth__eyebrow">Welcome back</p>
        <h1 class="auth__title">Sign in to keep learning.</h1>
        <p class="auth__subtitle">
          Your progress, saved lessons, and personalized path are waiting.
        </p>
        <ul class="auth__points">
          <li>Resume where you left off</li>
          <li>Sync your account across devices</li>
          <li>Keep everything backed up</li>
        </ul>
      </div>

      <div class="auth__card">
        <div class="auth__card-header">
          <h2>Sign in</h2>
          <p>Continue with your Skyinnk account.</p>
        </div>

        <button class="auth__primary" @click="goToLogin">
          Continue with Skyinnk
        </button>

        <div class="auth__meta">
          <div class="auth__status" v-if="mePending">Checking session…</div>
          <div class="auth__status" v-else-if="me?.authenticated">
            Signed in as
            <strong>{{ me.user?.email || me.user?.name || 'User' }}</strong>
          </div>
          <div class="auth__status auth__status--muted" v-else>
            Not signed in yet.
          </div>
          <div class="auth__status auth__status--warn" v-if="syncError">
            {{ syncError }}
          </div>

          <div class="auth__footer">
            <span>New here?</span>
            <NuxtLink to="/auth/sign-up">Create an account</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
