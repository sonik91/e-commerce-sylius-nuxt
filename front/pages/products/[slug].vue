<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <p>Le produit n'est pas disponible</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!--BLOC IMAGE-->
      <div v-if="product && product.images.length > 1">
        <ProductGallery :images="product.images" />
      </div>
      <div v-else-if="product && product.images.length === 1">
        <img :src="product.images[0]?.path" :alt="product.name" class="w-full rounded-lg">
      </div>
      <!--END BLOC IMAGE-->

      <!-- LEFT COLUMN-->
       <div>
        <div class="wrapper-title">
          <h1>{{ product.name }}</h1>
        </div>

        <div class="wrapper-price" v-if="currentVariant?.price && cartStore?.currencyCode">
          <PriceFormated 
              :amount="currentVariant.price" 
              :currency="cartStore.currencyCode"
          />
        </div>

        <div class="wrapper-option mb-3" v-if="product.options.length">
          <div v-for="option in product.options" :key="option.code" class="my-2">
            <p>{{ option.name }}</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <button 
                @click="selectOption(option.code, value)" 
                v-for="value in option.value" 
                :key="value"
                :class="[{
                  'bg-primary-700 text-white border-primary-700': isOptionSelected(option.code, value),
                  'bg-transparent text-primary-700 border-primary-700 hover:bg-primary-100 hover:text-primary-800': !isOptionSelected(option.code, value) && isOptionAvailable(option.code, value),
                  'bg-transparent text-gray-400 border-gray-400 line-through': !isOptionAvailable(option.code, value)
                }, 'flex gap-3 items-center justify-center font-semibold py-2 px-4 border rounded-md']"
                :disabled="!isOptionAvailable(option.code, value)"
              >
                {{ value }}
              </button>
            </div>
          </div>
        </div>

        <div class="wrapper-ratting" >
          <div class="flex flex-col" v-if="product.averageRating">
            <SfRating :value="product.averageRating" :max="5"/>
          </div>
        </div>

        <div class="wrapper-short-description" v-if="product.shortDescription">
          {{ product.shortDescription }}
        </div>

        <div class="wrapper-add-to-cart">
          <button @click="addToCart"
                  class="bg-blue-600 text-white px-6 py-2 rounded">
            Add to Cart
          </button>
        </div>

       </div>
      <!-- END LEFT COLUMN-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { Product } from '~/types/Product';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import ProductGallery from '~/components/ProductGallery.vue';
import { SfRating } from '@storefront-ui/vue';
import { Variant } from '~/types/Variant';

const route = useRoute()
const quantity = ref(1)
const cartStore = useCartStore()

const params = {
  locale: cartStore.localCode,
};

const { data } = await useFetch<Product|null>(`/api/products/${route.params.slug}`, {
  params,
})

const product = data.value;

  const selectedOptions = reactive<Record<string, string | number>>({});
  const currentVariant = ref<Variant | null>(null);


  // Initialiser avec le defaultVariant s'il existe
  if (product.defaultVariant) {
    currentVariant.value = product.defaultVariant;
    product.defaultVariant.options.forEach((option: {code: string, value: string|number}) => {
      selectedOptions[option.code] = option.value;
    });
  }

  // Met à jour la variante sélectionnée en fonction des options choisies
  const updateCurrentVariant = () => {
    currentVariant.value = product.variant?.find((variant: Variant) => {
      return variant.options.every(option => selectedOptions[option.code] === option.value);
    }) || null;
  };

  // Sélectionner une option
  const selectOption = (code: string, value: string | number) => {
    selectedOptions[code] = value;
    updateCurrentVariant();
  };

  // Vérifier si une option est sélectionnée
  const isOptionSelected = (code: string, value: string | number): boolean => {
    return selectedOptions[code] === value;
  };

  // Vérifier si une combinaison d'options est disponible
  const isOptionAvailable = (code: string, value: string | number): boolean => {
    const testOptions = { ...selectedOptions, [code]: value };
    return product.variant?.some((variant: Variant) => {
      return variant.inStock && variant.options.every(option => testOptions[option.code] === option.value);
    }) || false;
  };





const addToCart = async () => {
  return await cartStore.addToCart(currentVariant.value?.code, quantity.value)
}
</script>