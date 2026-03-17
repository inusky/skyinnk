export default defineNuxtRouteMiddleware(async (to) => {
  const user: any = await $fetch('/api/v1/auth/me');

  if (!user.authenticated) {
    const qs = new URLSearchParams({
      returnTo: to.fullPath,
    });

    return navigateTo(`/auth/login?${qs.toString()}`, { external: true });
  }
});
