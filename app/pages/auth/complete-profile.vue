<template>
  <div class="auth-wrapper">
    <div class="auth-card auth-card--wide">
      <h1>Complete your profile</h1>

      <p class="auth-note">
        Your account is ready. Add the remaining details below so we can finish
        creating your Skyinnk profile.
      </p>

      <div class="auth-field auth-field--email">
        <label for="auth-email">Email</label>
        <p id="auth-email" class="auth-value">{{ email || 'Loading...' }}</p>
      </div>

      <form class="auth-form" @submit.prevent="submitProfile">
        <div class="auth-field">
          <label for="full-name">Full name</label>
          <input
            id="full-name"
            v-model="fullName"
            type="text"
            placeholder="Your full name"
            autocomplete="name"
            @input="clearNameError"
          />
          <p v-if="nameError" class="auth-error">{{ nameError }}</p>
        </div>

        <div class="auth-field">
          <label for="mobile">
            Mobile
            <span class="auth-optional">Optional</span>
          </label>
          <input
            id="mobile"
            v-model="mobile"
            type="tel"
            placeholder="9876543210 or +14155552671"
            inputmode="tel"
            autocomplete="tel"
            @input="clearMobileError"
          />
          <p class="auth-helper">
            Enter a 10-digit Indian number or include your country code with a
            leading <code>+</code>.
          </p>
          <p v-if="mobileError" class="auth-error">{{ mobileError }}</p>
        </div>

        <p v-if="formError" class="auth-error auth-error--block">
          {{ formError }}
        </p>

        <button
          class="primary"
          type="submit"
          :disabled="isSubmitting || pending || !email"
        >
          {{ isSubmitting ? 'Saving...' : 'Save and continue' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { MOBILE_ERROR_MESSAGE, normalizeMobile } from '~~/utils/mobile';

const { me, pending, refresh } = useAuthState();

const fullName = ref('');
const mobile = ref('');
const nameError = ref('');
const mobileError = ref('');
const formError = ref('');
const isSubmitting = ref(false);
const didPrefill = ref(false);

const email = computed(
  () => me.value?.identity?.email || me.value?.user?.email || '',
);

watch(
  me,
  (value) => {
    if (!value || didPrefill.value) {
      return;
    }

    if (value.identity?.name) {
      fullName.value = value.identity.name;
    }

    if (value.user?.mobile) {
      mobile.value = value.user.mobile;
    }

    didPrefill.value = true;
  },
  { immediate: true },
);

const clearNameError = () => {
  nameError.value = '';
  formError.value = '';
};

const clearMobileError = () => {
  mobileError.value = '';
  formError.value = '';
};

const submitProfile = async () => {
  clearNameError();
  clearMobileError();

  const name = fullName.value.trim();

  if (!name) {
    nameError.value = 'Full name is required.';
  }

  if (!email.value) {
    formError.value = 'Your signed-in account is missing an email address.';
  }

  let normalizedMobile: string | null = null;

  try {
    normalizedMobile = normalizeMobile(mobile.value);
  } catch (error) {
    mobileError.value =
      error instanceof Error ? error.message : MOBILE_ERROR_MESSAGE;
  }

  if (nameError.value || mobileError.value || formError.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch('/api/v1/auth/complete-profile', {
      method: 'POST',
      body: {
        name,
        mobile: normalizedMobile,
      },
    });

    await refresh();
    await navigateTo('/');
  } catch (error: any) {
    formError.value =
      error?.data?.statusMessage ||
      error?.statusMessage ||
      'Unable to save your profile right now.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
@use '../../assets/scss/components/auth' as *;
</style>
