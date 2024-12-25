<template>
  <div class="md:container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Welcome to Our Store</h1>
    <ProductSlider  :params="params" title="Best product" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import ProductSlider from '~/components/ProductSlider.vue';

const cartStore = useCartStore();

const params = {
  page: 1,
  itemsPerPage: 5,
  locale: cartStore.localeCode,
};



</script>