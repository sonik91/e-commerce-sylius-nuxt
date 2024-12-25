<template>
  <div>
      <p v-if="title" class="text-4xl font-bold mb-4">{{ title }}</p>
      <div class="mx-4">
          <SfScrollable
              class="m-auto py-4 sm:items-stretch items-start w-full !gap-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              buttons-placement="floating"
              drag
              >
              <template #previousButton="defaultProps">
                  <SfButton
                  v-bind="defaultProps"
                  class="absolute !rounded-full z-10 left-[-30px] bg-white hidden sm:block"
                  :class="[ defaultProps.disabled ? '!hidden' : ''  ]"
                  variant="secondary"
                  size="lg"
                  square
                  >
                  <SfIconChevronLeft />
                  </SfButton>
              </template>
                  <div
                      v-for="(product, index) in products"
                      :key="product?.id || index"
                      :class="[
                      'shrink-0 p-2 w-[200px] sm:w-1/2 md:w-1/3 lg:w-1/4',
                      product != null ? 'animate-blur' : ''
                      ]"
                  >
                      <ProductCard class="relative w-full"  :product="product" />
                  </div>
              <template #nextButton="defaultProps">
                  <SfButton
                  v-bind="defaultProps"
                  class="absolute !rounded-full z-10 right-[-30px] bg-white hidden sm:block"
                  :class="[ defaultProps.disabled ? '!hidden' : ''  ]"
                  variant="secondary"
                  size="lg"
                  square
                  >
                  <SfIconChevronRight />
                  </SfButton>
              </template>
              </SfScrollable>
      </div>
  </div>


  
</template>

<script lang="ts" setup>
import {
  SfLink,
  SfButton,
  SfIconFavorite,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfScrollable,
} from '@storefront-ui/vue';

import ProductCard from '~/components/ProductCard.vue';
import { Product } from '~/types/Product';


const props = defineProps<{ params, title }>();

const params = props.params;
const title = props.title ?? null

const products = ref<Array<any>>([]);
const totalProduct = ref(0);

products.value = Array(1).fill(null);

// Fonction pour récupérer les produits réels
const fetchProducts = async () => {
  let response = [];
  try {
    response = await $fetch<{totalItems: number, status: number, products: Product[]} >('/api/products', {
      params,
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

// Exécuter les fetchs lors de la montée du composant
onMounted(async () => {
  await fetchProducts();
});

</script>

