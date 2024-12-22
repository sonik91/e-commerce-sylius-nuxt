<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Welcome to Our Store</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="product in featuredProducts" :key="product.id"
           class="bg-white rounded-lg shadow-md overflow-hidden">
           <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
const params = {
  page: 1,
  itemsPerPage: 3,
  locale: 'fr_FR',
  enabled: true,
};

// Appelez l'API avec les paramètres
const { data: featuredProducts, pending, error } = await useFetch('/api/products', {
  params,
});
</script>