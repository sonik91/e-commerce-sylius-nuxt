<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Our Products</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        v-for="(product, index) in products"
        :key="product?.id || index"
        :class="[
          'bg-white rounded-lg shadow-md overflow-hidden',
          product != null ? 'animate-blur' : ''
          ]"
      >
        <ProductCard  :product="product" />
      </div>
    </div>
    <div class="mt-5">
        <Pagination 
          :totalItems="totalProduct??0"
          :currentPage="params.page??1"
          :itemsPerPage="params.itemsPerPage??30"
          @pageChange="handlePageChange"
        />
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import ProductCard from '~/components/ProductCard.vue';
import Pagination from '~/components/Pagination.vue';
import { Product } from '~/types/Product';
import { useRoute } from 'vue-router';

const cartStore = useCartStore();

const params = {
  page: 1,
  itemsPerPage: 12,
  locale: cartStore.localeCode,
};

const products = ref<Array<any>>([]);
const totalProduct = ref(0);

const startValueProduct = Array(1).fill(null);

products.value = startValueProduct;

// Fonction pour récupérer les produits réels
const fetchProducts = async () => {
  let response = [];
  products.value = startValueProduct;
  try {
    response = await $fetch<{totalItems: number, status: number, products: Product[]} >('/api/products', {
      params
    });
  } catch (err) {
    console.error('Failed to fetch products:', err.message);
  }

  if(Array.isArray(response?.products)){

    totalProduct.value = response.totalItems?? 0;
    
    response.products.forEach((value,key)=>{
      const delay = 200
      setTimeout(()=>{
        products.value[key] = value
      },delay * key)
      
    });    
  }
  else{
    products.value = [];
    totalProduct.value = 0;

  }
};

const handlePageChange = (newPage) => {
  params.page = newPage;
  fetchProducts(); // Recharge les produits pour la nouvelle page
};

// Exécuter les fetchs lors de la montée du composant
onMounted(async () => {
  await fetchProducts();
});

</script>
