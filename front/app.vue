<template>
  <NuxtLayout>
    <Notification />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>  
  const authStore = useAuthStore();
  authStore.loadFromCookies();

  const cartStore = useCartStore();
  cartStore.initCart()
</script>