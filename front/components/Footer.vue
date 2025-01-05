<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-lg font-semibold mb-4">About Us</h3>
          <p class="text-gray-400">
            Your trusted online store for quality products and excellent service.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/categorie" class="text-gray-400 hover:text-white">
                Products
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class="text-gray-400 hover:text-white">
                Cart
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Contact Us</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Shipping Policy</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white">Returns & Exchanges</a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Newsletter</h3>
          <form @submit.prevent="subscribeNewsletter" class="space-y-4">
            <input 
              type="email" 
              v-model="email"
              placeholder="Enter your email"
              class="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button 
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} EShop. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const email = ref('')

const subscribeNewsletter = () => {
  // TODO: Implement newsletter subscription
  console.log('Newsletter subscription for:', email.value)
  email.value = ''
}
</script>