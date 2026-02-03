// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/mdc',
    '@pinia/nuxt',
    '@nuxt/image',
    '@auth0/auth0-nuxt',
  ],
  css: ['./app/assets/scss/main.scss', './app/assets/css/clerk.css'],
  app: {
    head: {
      title: 'Skyinnk - Expressive learning platform',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    clerkSecretKey: process.env.NUXT_CLERK_SECRET_KEY,
    auth0: {
      domain: process.env.NUXT_AUTH0_DOMAIN ?? process.env.AUTH0_DOMAIN,
      clientId: process.env.NUXT_AUTH0_CLIENT_ID ?? process.env.AUTH0_CLIENT_ID,
      clientSecret:
        process.env.NUXT_AUTH0_CLIENT_SECRET ?? process.env.AUTH0_CLIENT_SECRET,
      sessionSecret:
        process.env.NUXT_AUTH0_SESSION_SECRET ?? process.env.AUTH0_SECRET,
      appBaseUrl:
        process.env.NUXT_AUTH0_APP_BASE_URL ?? process.env.AUTH0_BASE_URL,
    },
    auth0Management: {
      domain: process.env.AUTH0_MGMT_DOMAIN ?? process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_MGMT_CLIENT_ID,
      clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
      audience: process.env.AUTH0_MGMT_AUDIENCE,
    },
    public: {
      clerkPublishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
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
