export default defineNuxtRouteMiddleware(async () => {
  const { me, pending, refresh } = useAuthState();

  if (pending.value) {
    await refresh();
  }

  if (me.value?.authenticated) {
    return navigateTo('/');
  }
});
