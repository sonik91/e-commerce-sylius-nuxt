<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600">
          EShop
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-6">
          <NuxtLink to="/" class="text-gray-700 hover:text-blue-600">
            Home
          </NuxtLink>
          <NuxtLink to="/products" class="text-gray-700 hover:text-blue-600">
            Products
          </NuxtLink>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Cart -->
          <button @click="isCartOpen = true" class="relative">
            <span class="sr-only">Cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartItemsCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartItemsCount }}
            </span>
          </button>

          <!-- Auth -->
          <template v-if="isAuthenticated">
            <button @click="logout" class="text-gray-700 hover:text-blue-600">
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink :to="loginUrl" class="text-gray-700 hover:text-blue-600">
              Login
            </NuxtLink>
          </template>
        </div>
      </nav>
    </div>

    <!-- Cart Modal -->
    <CartModal 
      :is-open="isCartOpen"
      @close="isCartOpen = false"
    />
  </header>
</template>

<script setup>
const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const isCartOpen = ref(false)

const currentUrl = computed(()=>encodeURIComponent(route.fullPath));

const loginUrl = ref(`/login?redirect=${currentUrl.value}`);

// Mettre à jour `loginUrl` chaque fois que la route change
watch(() => route.fullPath, (newPath) => {
  if (newPath === "/" || newPath.split('?')[0] === '/login')
  {
    loginUrl.value='/login?redirect=%2f';//redirige sur la home
  }
  else{
    loginUrl.value = `/login?redirect=${encodeURIComponent(newPath.split('?')[0])}`;
  }
  
});

const isAuthenticated = computed(() => authStore.isAuthenticated)
const cartItemsCount = computed( () =>
  Array.isArray(cartStore.items) ? cartStore.items.reduce((acc, item) => acc + item.quantity, 0) : 0  
)

const logout = () => {
  authStore.logout();
  cartStore.ressetCart();
  //navigateTo('/')
}

</script>