export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Ajoutez l'URL de la page actuelle comme query parameter
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

})