<template>
  <div>
    <div v-if='Array.isArray(categorie?.images) && categorie.images.find(image=>image.type === "top-categorie")' class="wrapper-banner relative w-full h-64">
        <img class="object-cover w-full h-full" :src='categorie.images.find(image=>image.type === "top-categorie")?.path' alt="image">
        <h1 class='text-3xl font-bold mb-6 absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%]'> <i v-if="!categorie?.name" class='block animate-pulse bg-gray-300 w-32 h-10'></i> {{ categorie?.name }}</h1>

      </div>
      <h1 v-else class='text-3xl px-4 font-bold mb-6'> <i v-if="!categorie?.name" class='block animate-pulse bg-gray-300 w-32 h-10'></i> {{ categorie?.name }}</h1>
      
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-if="notProductValide">
          <p>Desoler pas de produit dans cette categorie</p>
        </div>
        <div
          v-else
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
const route = useRoute();
const notProductValide = ref(false);
const categorie = ref({});

const params = {
  page: 1,
  itemsPerPage: 12,
  locale: cartStore.localeCode,
  //taxon ajouter par la fonction fetchCategorie
};

const products = ref<Array<any>>([]);
const totalProduct = ref(0);

const startValueProduct = Array(1).fill(null);

products.value = startValueProduct;


//fonction pour recupere les info de la categorie
const fetchCategorie = async() => {
  const slug = route.params.slug ?? false;

  if(!slug){
    console.error('pas de slug fournis');
    return false
  }

  let response;
  try{
    response = await $fetch(`/api/categorie/${slug}`);
  } catch(err){
    console.error('Failed to fetch categorie:', err.message);
    return false
  }

  if(!response?.success??false){
    return false
  }

  if(response?.item?.code){
    params.taxon = response.item.code
  }

  return response?.item ?? false;
}

// Fonction pour récupérer les produits réels
const fetchProducts = async () => {
  let response = [];
  products.value = [null];
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

  notProductValide.value = totalProduct.value <= 0;
};

const handlePageChange = (newPage) => {
  params.page = newPage;
  products.value = [null];
  window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  fetchProducts(); // Recharge les produits pour la nouvelle page
};

categorie.value = await fetchCategorie();


// Exécuter les fetchs lors de la montée du composant
onMounted(async () => {
  //on initie la categorie
  await fetchProducts();
  
});

</script>
