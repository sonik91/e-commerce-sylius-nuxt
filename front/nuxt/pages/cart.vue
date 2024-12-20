<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
    
    <div v-if="cartStore.items.length" class="grid grid-cols-1 gap-6">
      <div v-for="item in cartStore.items" :key="item.id"
           class="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
        <img :src="item.images[0]?.path" :alt="item.name"
             class="w-24 h-24 object-cover rounded">
        <div class="flex-grow">
          <h2 class="text-xl font-semibold">{{ item.name }}</h2>
          <p class="text-gray-600">
            <PriceFormated 
              :amount="item.unitPrice ?? '00'" 
              :currency="cartStore?.currencyCode"
            /> x {{ item.quantity }}</p>
        </div>
        <div class="text-xl font-bold">
          <PriceFormated 
              :amount="item.total ?? '00'" 
              :currency="cartStore?.currencyCode"
            />
        </div>
      </div>
      
      <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <span class="text-xl font-bold">Total:</span>
        <span class="text-2xl font-bold text-blue-600">
          <PriceFormated 
              :amount="cartStore.total ?? '00'" 
              :currency="cartStore?.currencyCode"
            />
          </span>
      </div>
      
      <div class="flex justify-end">
        <NuxtLink to="/checkout"
                  class="bg-green-600 text-white px-8 py-3 rounded-lg text-lg">
          Proceed to Checkout
        </NuxtLink>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-xl text-gray-600">Your cart is empty</p>
      <NuxtLink to="/products"
                class="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded">
        Browse Products
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const cartStore = useCartStore()

</script>