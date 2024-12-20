<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Our Products</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product.id"
           class="bg-white rounded-lg shadow-md overflow-hidden">
           <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
const cartStore = useCartStore()

const params = {
  page: 1,
  itemsPerPage: 30,
  locale: cartStore.localeCode,
  enabled: true,
};

// Appelez l'API avec les paramètres
const { data: products } = await useFetch('/api/products', {
  params,
});

const addToCart = async (productId) => {
  await cartStore.addToCart(productId)
}
</script>