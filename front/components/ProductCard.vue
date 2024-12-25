<template>
  <div class="border border-neutral-200 rounded-md hover:shadow-lg relative flex flex-col justify-between h-full">
    <div>
      <div v-if="!product" class="block"><div class="block object-cover h-auto rounded-md aspect-square animate-pulse bg-gray-300 w-full"></div></div>
      <SfLink v-else :href="product?.url ?? ''" class="block">
        <img
          :src="product?.images[0]?.path ?? '/defaultProduct.jpg'"
          :alt="product?.name ?? ''"
          class="block object-cover h-auto rounded-md aspect-square"
          width="100%"
          height="100%"
        />
      </SfLink>
      
      <div class="p-4 border-t border-neutral-200">

        <p v-if="!product" class="animate-pulse bg-gray-300 w-full"></p>
        <SfLink v-else :href="product?.url ?? ''" variant="secondary" class="no-underline">{{ product?.name ?? "" }}</SfLink>

        <div class="flex items-center pt-1">
          <div v-if="product?.averageRating">
            <SfRating size="xs" :value="product.averageRating" :max="5" />
          </div>
        </div>

        <p v-if="product" class="my-2 font-normal leading-5 typography-text-sm text-neutral-700 line-clamp-3">
          {{ product?.shortDescription ?? "" }}
        </p>
        <p v-else class="my-2 font-normal leading-5 typography-text-sm text-neutral-700 line-clamp-3 animate-pulse bg-gray-300 w-full h-16"></p>

        <div v-if="product">
          <span class="block pb-2 font-bold typography-text-lg" v-if="currentVariant?.price && cartStore?.currencyCode">
            <PriceFormated 
              :amount="currentVariant?.price ?? '00'" 
              :currency="cartStore?.currencyCode"
            />
          </span>
        </div>
        <div v-else class="animate-pulse bg-gray-300 w-10 h-5"></div>

        <div class="wrapper-option mb-3" v-if="product?.options.length">
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
      </div>
    </div>

    <div>
      <div class="px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-1" v-if="product">
        <NuxtLink :to="product?.url ?? ''" class="flex gap-3 items-center justify-center w-full bg-transparent hover:bg-primary-700 text-primary-700 font-semibold hover:text-white py-2 px-4 border border-primary-700 hover:border-transparent rounded-md">
          <SfIconVisibility size="sm" />
          see more
        </NuxtLink>

        <button 
          @click="addToCart" 
          :disabled="!currentVariant?.inStock" 
          :class="[
            currentVariant?.inStock ? 'bg-primary-700 hover:bg-primary-900 text-white border-primary-700 hover:border-transparent' : 'bg-transparant text-gray-500 border-gray-200',
            'flex gap-3 items-center justify-center w-full font-semibold py-2 px-4 border rounded-md'
          ]"
        >
          Add to Cart
        </button>
      </div>
      <div v-else class="px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
        <div class="animate-pulse bg-gray-300 w-full h-5"></div>
        <div class="animate-pulse bg-gray-300 w-full"></div>
      </div>

      <p v-if="product" :class="[currentVariant?.inStock ? 'text-green-500' : 'text-red-500', 'px-4']">
        {{ currentVariant?.inStock ? "En stock" : "Rupture" }}
      </p>
      <p v-else class="px-4 animate-pulse bg-gray-300 w-full"></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfRating, SfLink, SfIconVisibility } from '@storefront-ui/vue';
import { Product } from '../types/Product';
import { useCartStore } from '~/stores/cart';
import { ref, computed, reactive } from 'vue';
import { Variant } from '~/types/Variant';

const cartStore = useCartStore();

const props = defineProps<{ product: Product | null }>();

const selectedOptions = reactive<Record<string, string | number>>({});
const currentVariant = ref<Variant | null>(null);

// Initialiser avec le defaultVariant s'il existe

if (props.product?.defaultVariant) {
  currentVariant.value = props.product.defaultVariant;
  props.product.defaultVariant.options.forEach((option: {code: string, value: string|number}) => {
    selectedOptions[option.code] = option.value;
  });
}

// Met à jour la variante sélectionnée en fonction des options choisies
const updateCurrentVariant = () => {
  currentVariant.value = props.product.variant?.find((variant: Variant) => {
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
  return props.product.variant?.some((variant: Variant) => {
    return variant.inStock && variant.options.every(option => testOptions[option.code] === option.value);
  }) || false;
};

// Ajouter au panier
const addToCart = async () => {
  return await cartStore.addToCart(currentVariant.value?.code, 1);
};

</script>
