import { watch } from 'vue';
import { useAuth } from '@clerk/vue';

export default defineNuxtRouteMiddleware(async () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(isLoaded, () => {
        unwatch();
        resolve();
      });
    });
  }

  if (isSignedIn.value) {
    await $fetch('/api/v1/auth/sync', {
      method: 'post',
    });
  } else {
    return navigateTo('auth/sign-in');
  }
});
