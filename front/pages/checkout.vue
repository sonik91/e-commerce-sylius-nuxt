<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" v-model="form.name" required
                   class="w-full px-4 py-2 border rounded">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" v-model="form.email" required
                   class="w-full px-4 py-2 border rounded">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Address</label>
            <textarea v-model="form.address" required
                      class="w-full px-4 py-2 border rounded"></textarea>
          </div>
          
          <button type="submit"
                  class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg">
            Place Order
          </button>
        </form>
      </div>
      
      <div>
        <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <div v-for="item in cartStore.items" :key="item.productId"
               class="flex justify-between py-2">
            <span>{{ item.product.name }} x {{ item.quantity }}</span>
            <span>${{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
          
          <div class="border-t mt-4 pt-4">
            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${{ cartStore.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const cartStore = useCartStore()
const form = ref({
  name: '',
  email: '',
  address: ''
})

const submitOrder = async () => {
  // Mock order submission
  console.log('Order submitted:', {
    ...form.value,
    items: cartStore.items,
    total: cartStore.total
  })
}

// Ensure cart is loaded
await cartStore.fetchCart()
</script>