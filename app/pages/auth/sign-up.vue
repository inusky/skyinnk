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

const goToSignup = () =>
  navigateTo(
    `/auth/login?screen_hint=signup&returnTo=${encodeURIComponent(returnTo)}`,
    { external: true },
  );
</script>

<template>
  <section class="auth auth--up">
    <div class="auth__bg" />
    <div class="auth__grid">
      <div class="auth__card">
        <div class="auth__card-header">
          <h2>Create an account</h2>
          <p>Create your Skyinnk account in under a minute.</p>
        </div>

        <button class="auth__primary" @click="goToSignup">
          Continue with Skyinnk
        </button>

        <div class="auth__meta">
          <div class="auth__status" v-if="mePending">Checking session…</div>
          <div class="auth__status" v-else-if="me?.authenticated">
            Signed in as
            <strong>{{ me.user?.email || me.user?.name || 'User' }}</strong>
          </div>
          <div class="auth__status auth__status--muted" v-else>
            No account yet? Create one now.
          </div>
          <div class="auth__status auth__status--warn" v-if="syncError">
            {{ syncError }}
          </div>

          <div class="auth__footer">
            <span>Already have an account?</span>
            <NuxtLink to="/auth/sign-in">Sign in</NuxtLink>
          </div>
        </div>
      </div>

      <div class="auth__copy">
        <p class="auth__eyebrow">Join Skyinnk</p>
        <h1 class="auth__title">Create your learning identity.</h1>
        <p class="auth__subtitle">
          Build your profile, track milestones, and unlock your next chapter.
        </p>
        <ul class="auth__points">
          <li>Curated learning paths</li>
          <li>Progress snapshots & streaks</li>
          <li>Access on any device</li>
        </ul>
      </div>
    </div>
  </section>
</template>
