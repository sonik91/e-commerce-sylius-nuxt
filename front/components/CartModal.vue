<template>
  <Transition
    enter-active-class="transition ease-in-out duration-300 transform"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition ease-in-out duration-300 transform"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div v-if="isOpen" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold">Shopping Cart</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <template v-if="cartStore.items.length">
          <div v-for="item in cartStore.items" :key="item.id" 
               class="flex gap-4 mb-4 p-2 border-b">
            <img :src="item?.images[0]?.path" :alt="item.productName"
                 class="w-20 h-20 object-cover rounded">
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.productName }}</h3>
              <p class="text-gray-600">
                <PriceFormated v-if="item?.total && cartStore?.currencyCode"
                  :amount="item?.total ?? '00'" 
                  :currency="cartStore.currencyCode"
                />
              </p>
              <!---->
              <div class="relative flex items-center">
                  <button @click="cartStore.updateQty(item.id, item.quantity - 1)" type="button" id="decrement-button" data-input-counter-decrement="counter-input" class="flex-shrink-0 bg-primary-100 dark:bg-primary-700 dark:hover:bg-primary-600 dark:border-primary-600 hover:bg-primary-200 inline-flex items-center justify-center border border-primary-300 rounded-md h-5 w-5 focus:ring-primary-100 dark:focus:ring-primary-700 focus:ring-2 focus:outline-none">
                      <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                      </svg>
                  </button>
                  <input type="text" id="counter-input" data-input-counter class="flex-shrink-0 text-primary-900 dark:text-black border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center" placeholder="" :value="item.quantity" disabled />
                  <button @click="cartStore.updateQty(item.id, item.quantity + 1)" type="button" id="increment-button" data-input-counter-increment="counter-input" class="flex-shrink-0 bg-primary-100 dark:bg-primary-700 dark:hover:bg-primary-600 dark:border-primary-600 hover:bg-primary-200 inline-flex items-center justify-center border border-primary-300 rounded-md h-5 w-5 focus:ring-primary-100 dark:focus:ring-primary-700 focus:ring-2 focus:outline-none">
                      <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                      </svg>
                  </button>
              </div>
              <!---->
            </div>
          </div>
        </template>
        <div v-else class="text-center py-8 text-gray-500">
          Your cart is empty
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t p-4">
        <div class="flex justify-between mb-4" v-if="cartStore?.taxExcludedTotal && cartStore?.currencyCode">
          <span class="font-semibold">Total HT:</span>
          <span class="font-bold">
            <PriceFormated
              :amount="cartStore?.taxExcludedTotal ?? '00'" 
              :currency="cartStore.currencyCode"
            />
          </span>
        </div>

        <div class="flex justify-between mb-4" v-if="cartStore?.shippingTotal && cartStore?.currencyCode">
          <span class="font-semibold">Transporteur:</span>
          <span class="font-bold">
            <PriceFormated
              :amount="cartStore?.shippingTotal ?? '00'" 
              :currency="cartStore.currencyCode"
            />
          </span>
        </div>

        <div class="flex justify-between mb-4" v-if="cartStore?.taxTotal && cartStore?.currencyCode">
          <span class="font-semibold">Total taxe:</span>
          <span class="font-bold">
            <PriceFormated
              :amount="cartStore?.taxTotal ?? '00'" 
              :currency="cartStore.currencyCode"
            />
          </span>
        </div>

        <div class="flex justify-between mb-4" v-if="cartStore?.total && cartStore?.currencyCode">
          <span class="font-semibold">Total:</span>
          <span class="font-bold">
            <PriceFormated
              :amount="cartStore?.total ?? '00'" 
              :currency="cartStore.currencyCode"
            />
          </span>
        </div>
        <NuxtLink 
          v-if="cartStore.items.length"
          to="/cart"
          @click="close"
          class="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
        >
          View Cart
        </NuxtLink>
      </div>
    </div>
  </Transition>

  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity ease-linear duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity ease-linear duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" 
         class="fixed inset-0 bg-black bg-opacity-50 z-40"
         @click="close">
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const cartStore = useCartStore()

const close = () => {
  emit('close')
}
</script>