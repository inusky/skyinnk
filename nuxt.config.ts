// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/mdc', '@pinia/nuxt', '@clerk/nuxt', '@nuxt/image'],
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
    public: {
      clerkPublishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  },
  image: {
    domains: ['skyinnk-r2.skyinnk-api.workers.dev'],
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  nitro: {
    rollupConfig: {
      external: [/^@prisma\//, /\.wasm$/],
    },
  },
  ssr: true,
});
