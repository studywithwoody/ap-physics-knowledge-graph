export default defineNuxtConfig({
  compatibilityDate: '2026-10-24',
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '@fontsource/source-sans-3/latin-400.css',
    '@fontsource/source-sans-3/latin-600.css',
    '@fontsource/source-sans-3/latin-700.css',
    '@fontsource/source-serif-4/latin-600.css',
    '@fontsource/source-serif-4/latin-700.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      title: '講義知識圖譜',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'AP 課程講義知識圖譜：依單元、類型與先備關係瀏覽定義、公式與出處。',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/gaps'],
      failOnError: true,
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/gaps': { prerender: true },
  },
  typescript: {
    strict: true,
  },
})
