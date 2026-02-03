export default defineNuxtRouteMiddleware(async (to) => {
  const { me, pending, refresh } = useAuthState();

  if (pending.value) {
    await refresh();
  }

  if (!me.value?.authenticated) {
    return navigateTo(
      `/auth/sign-in?returnTo=${encodeURIComponent(to.fullPath)}`,
    );
  }

  await $fetch('/api/v1/auth/sync', {
    method: 'POST',
  });
});
