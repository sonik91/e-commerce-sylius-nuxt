// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   modules: ['@pinia/nuxt', '@storefront-ui/nuxt', 'nuxt-auth-utils'],
  plugins: ['~/plugins/cart-watch.ts'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  //devServer: {
  //  port: process.env.NUXT_DEV_PORT || 3001, // Définit le port pour le serveur de développement
  //},
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET || 'secret-key'
  },
  auth: {
    token: {
      storage: 'cookie', // Stockage sécurisé du JWT dans un cookie HTTP-only
      name: 'auth_token', // Nom du cookie
      type: 'Bearer', // Préfixe pour le header Authorization
    },
    endpoints: {
      login: '/api/auth/login', // Endpoint Sylius pour la connexion
      //refresh: '/api/token/refresh', // Endpoint pour rafraîchir le JWT
      logout: '/api/auth/logout', // Endpoint pour la déconnexion
      user: '/api/auth/user', // Endpoint pour récupérer les informations utilisateur
    },
    redirect: {
      login: '/login', // Redirection si non authentifié
      logout: '/', // Redirection après déconnexion
      home: '/dashboard', // Redirection après connexion
    },
  }
})