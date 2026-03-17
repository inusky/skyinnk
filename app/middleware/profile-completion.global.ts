export default defineNuxtRouteMiddleware(async (to) => {
  const auth: any = await $fetch('/api/v1/auth/me');

  if (!auth.authenticated) {
    if (to.path === '/auth/complete-profile') {
      const qs = new URLSearchParams({
        returnTo: to.fullPath,
      });

      return navigateTo(`/auth/login?${qs.toString()}`, { external: true });
    }

    return;
  }

  if (!auth.hasDatabaseUser && to.path !== '/auth/complete-profile') {
    return navigateTo('/auth/complete-profile');
  }

  if (auth.hasDatabaseUser && to.path === '/auth/complete-profile') {
    return navigateTo('/');
  }
});
