<template>
  <NuxtLayout>
    <Notification />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>  
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { watch } from 'vue'
  onBeforeMount(async () => {
    watch(
      () => useAuthStore().token, // Surveille l'état `token`
      (newToken) => {
        console.log(newToken)
        const tokenCookie = useCookie('auth_token');
        tokenCookie.value = newToken; // Met à jour le cookie
      }
    );
    
    watch(
      () => useAuthStore().idCustomer, // Surveille l'état `idCustomer`
      (newIdCustomer) => {
        const tokenIdCustomer = useCookie('id_customer');
        tokenIdCustomer.value = newIdCustomer?.toString(); // Met à jour le cookie
      }
    );

    watch(
      () => useCartStore().tokenValue, // Surveille l'état `tokenValue`
      (newTokenValue) => {
        const tokenCart = useCookie('cart_token');
        tokenCart.value = newTokenValue; // Met à jour le cookie
      }
    );

    const authStore = useAuthStore();
    authStore.loadFromCookies();

    const cartStore = useCartStore();
    cartStore.initCart()
  });
  
</script>