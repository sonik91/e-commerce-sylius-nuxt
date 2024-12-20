export default defineNuxtPlugin((nuxtApp) => {
    const cartStore = useCartStore();
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated)
  
    watch(isAuthenticated, async (newValue) => {
      if (process.client) {
        // Si le token du cart est créé, on met à jour le cart
        if (newValue === true) {
          await cartStore.fetchCart();
        }
  
        // Si le token du cart est supprimé, on vide le panier
        if (newValue === false) {
          await cartStore.ressetCart();
        }
      }
    });
  });
  