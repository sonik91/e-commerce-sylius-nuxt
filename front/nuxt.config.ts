// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   modules: [
    '@pinia/nuxt',
    '@storefront-ui/nuxt'
  ],
  plugins: ['~/plugins/cart-watch.ts'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  //devServer: {
  //  port: process.env.NUXT_DEV_PORT || 3001, // Définit le port pour le serveur de développement
  //},
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET || 'secret-key'
  },
})
