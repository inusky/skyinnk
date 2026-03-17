export interface AuthIdentity {
  auth0Id: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
}

export interface AuthUser {
  id: string;
  auth0Id: string;
  email: string;
  name: string;
  mobile: string | null;
  imageUrl: string | null;
  deletedAt: string | null;
}

export interface AuthMeResponse {
  authenticated: boolean;
  hasDatabaseUser: boolean;
  identity: AuthIdentity | null;
  user: AuthUser | null;
}

export const useAuthState = () => {
  const { data, pending, refresh, error } = useFetch<AuthMeResponse>(
    '/api/v1/auth/me',
    {
      key: 'auth-me',
    },
  );

  const isSignedIn = computed(() => data.value?.authenticated === true);
  const isSignedOut = computed(() => data.value?.authenticated === false);
  const hasDatabaseUser = computed(() => data.value?.hasDatabaseUser === true);
  const displayName = computed(
    () =>
      data.value?.user?.name ||
      data.value?.identity?.name ||
      data.value?.user?.email ||
      data.value?.identity?.email ||
      'Account',
  );
  const avatarUrl = computed(
    () => data.value?.user?.imageUrl || data.value?.identity?.imageUrl || null,
  );

  return {
    me: data,
    pending,
    refresh,
    error,
    isSignedIn,
    isSignedOut,
    hasDatabaseUser,
    displayName,
    avatarUrl,
  };
};
