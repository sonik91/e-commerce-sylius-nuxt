<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <!-- Mobile Pagination -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Previous
      </button>
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Next
      </button>
    </div>

    <!-- Desktop Pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous Button -->
          <button
            @click="goToPreviousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span class="sr-only">Previous</span>
            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Pages -->
          <template v-for="page in pages">
            <span
              v-if="page.state === 'separateur'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
            <button
              v-else
              @click="goToPage(page.value)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                page.state === 'current-page' ? 'z-10 bg-indigo-600 text-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900'
              ]"
            >
              {{ page.value }}
            </button>
          </template>

          <!-- Next Button -->
          <button
            @click="goToNextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span class="sr-only">Next</span>
            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  totalItems: Number,
  currentPage: Number,
  itemsPerPage: Number,
});


const pagesBefforeCurent: number = 1;
const pagesAfterCurent: number = 2;

const emit = defineEmits(['pageChange']);

// Calculs dynamiques
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1);
const endItem = computed(() => Math.min(props.totalItems, props.currentPage * props.itemsPerPage));

// Générer les pages pour la pagination
const pages = computed(() => {

  const pagesArray: Array<{ value: string; state: string }> = [];

  //ajout de la premiere page
  pagesArray.push({
      value: '1',
      state: 1 === props.currentPage ? 'current-page' : 'page'
  })

  //ajout du séparateur
  //si la page courante est superieur a la page 1 + le nombres de page que l'on affiche avant 
  if(props.currentPage > 1 + pagesBefforeCurent + 1){
      pagesArray.push({ value: '...', state: 'separateur' })
  }

  //ajout du nombre de page avant la curent page
  for(let i = pagesBefforeCurent; i > 0; i--){
      if( props.currentPage - i > 1 ){
          pagesArray.push({ value: (props.currentPage - i).toString(), state: 'page' })  
      }
  }

  //ajout de la page courante
  if(props.currentPage > 1 && props.currentPage < totalPages.value){
      pagesArray.push({ value: props.currentPage.toString(), state: 'current-page' })  
  }

  //ajout du nombre de page après la curent page
  for(let i = 1; i <= pagesAfterCurent; i++){
      if( props.currentPage + i < totalPages.value  ){
          pagesArray.push({ value: (props.currentPage + i).toString(), state: 'page' })  
      }
  }

  //ajout du séparateur
  if(props.currentPage + pagesAfterCurent + 1 < totalPages.value){
      pagesArray.push({ value: '...', state: 'separateur' })
  }

  if(totalPages.value > 1){
      pagesArray.push({ value: totalPages.value.toString(), state: props.currentPage === totalPages.value? 'current-page' : 'page' })
  }

  return pagesArray;
});

// Méthodes pour changer de page
const goToPreviousPage = () => {
  if (props.currentPage > 1) emit('pageChange', props.currentPage - 1);
};

const goToNextPage = () => {
  if (props.currentPage < totalPages.value) emit('pageChange', props.currentPage + 1);
};

const goToPage = (page: string) => {
  emit('pageChange', parseInt(page, 10));
};
</script>
