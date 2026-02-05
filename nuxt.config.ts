// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@auth0/auth0-nuxt'],
  css: ['./app/assets/scss/main.scss', './app/assets/css/clerk.css'],
  app: {
    head: {
      title: 'Skyinnk - Expressive learning platform',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    clerkSecretKey: process.env.NUXT_CLERK_SECRET_KEY ?? '',
    auth0: {
      domain: process.env.NUXT_AUTH0_DOMAIN ?? '',
      clientId: process.env.NUXT_AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.NUXT_AUTH0_CLIENT_SECRET ?? '',
      secret: process.env.NUXT_AUTH0_SECRET ?? '',
      appBaseUrl:
        process.env.NUXT_AUTH0_APP_BASE_URL ??
        (process.env.NODE_ENV === 'production'
          ? 'https://skyinnk.onrender.com'
          : 'http://localhost:3000'),
      routes: {
        login: '/auth/login',
        callback: '/auth/callback',
        logout: '/auth/logout',
      },
    },
    public: {
      clerkPublishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
    },
    authSessionPassword: process.env.AUTH_SESSION_PASSWORD ?? '',
    authCookieName: process.env.AUTH_COOKIE_NAME || 'skyinnk_auth',
  },
  image: {
    domains: ['skyinnk-r2.skyinnk-api.workers.dev', 'i.ytimg.com'],
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  nitro: {
    preset: 'node-server',
    rollupConfig: {
      external: [/^@prisma\//, /\.wasm$/],
    },
  },
  ssr: true,
});
