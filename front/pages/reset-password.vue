<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="handleSubmit" class="space-y-6">  
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input 
              type="email" 
              name="email" 
              v-model="email"
              id="email" 
              autocomplete="email" 
              required="" 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
            <p
                role="alert"
                :class="[
                  alerteContent.email === null || alerteContent.email === '' ? 'hidden' : '',
                  'typography-text-base text-red-700'
                ]"
              >
              {{ alerteContent.email }}
            </p>
          </div>
  
          <div
              role="alert"
              :class="[
                alerteContent.global === null || alerteContent.global === '' ? 'hidden' : '',
                'items-start md:items-center max-w-[600px] shadow-md bg-negative-100 pr-2 pl-4 ring-1 ring-negative-300 typography-text-sm md:typography-text-base py-1 rounded-md'
              ]"
          >
            <p class="py-2 mr-2">{{ alerteContent.global }}</p>
          </div>
          <div
              role="alert"
              :class="[
                alerteContent.success === null || alerteContent.success === '' ? 'hidden' : '',
                'items-start md:items-center max-w-[600px] shadow-md bg-green-100 pr-2 pl-4 ring-1 ring-green-300 typography-text-sm md:typography-text-base py-1 rounded-md'
              ]"
          >
            <p class="py-2 mr-2">{{ alerteContent.success }}</p>
          </div>
          <div>
            <button 
              type="submit" 
              :class="[
                submitButtonAnimationFail ? 'animate-shake' : '',
                'flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              ]"
            >
              reset password
            </button>
          </div>
        </form>
  
        <p class="mt-10 text-center text-sm/6 text-gray-500">
          You have account?
          {{ ' ' }}
          <a href="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Connect to account</a>
        </p>
      </div>
    </div>
  </template>  
  
  <script setup lang="ts">
  import { watch } from 'vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '~/stores/auth';
  import { useCartStore } from '~/stores/cart';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  const email = ref('');
  const localeCode = cartStore.localeCode;
  
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  
  const alerteContent = ref({
    global: "",
    success: "",
    email: ""
  });
  const submitButtonAnimationFail = ref(false);
  
  
  
  // Redirection si l'utilisateur est connecté
  if (authStore.isAuthenticated) {
    router.push('/');
  }
  
  const handleSubmit = async () => {
    try {
      //reset des alert
      alerteContent.value = {
        global: "",
        success: "",
        email: ""
      };
      const response = await authStore.resetPassword({ email: email.value, localeCode: localeCode});
        
      //si une erreur c'est produite
      if(!response.success){
        const titleError = response.error?.title??'Une erreur est survenue lors de la réanitialisation de votre mots de passe'
        console.log(response.error);
  
        if(Array.isArray(response.error?.detail) && response.error.detail.length){
          response.error.detail.forEach((e: {message:string, propertyPath:string})=>{
            console.log([e.message, e.propertyPath])
            if(e.propertyPath in alerteContent.value){
              alerteContent.value[e.propertyPath] = e.message
            }
            alerteContent.value.global = titleError;
          })
        }
  
        alerteContent.value.global = titleError;
  
        submitButtonAnimationFail.value = true;
        setTimeout(() => {
          submitButtonAnimationFail.value = false;
        }, 2000);
  
      }
  
      else if(response.success){
        alerteContent.value.success = `Le mots de passe de votre compte à été réinitialisé avec succes. veuillez verrifier consultez votre boite mail : ${email.value}`;
      }
      else{
        throw new Error('Erreur lors de la connexion. Identifiant incorecte');
      }
    } catch (error) {
      console.error('Resset password failed:', error);
      alerteContent.value.global = "Une erreur est survenue lors de la réinitialisation du mots de passe de votre compte."
      submitButtonAnimationFail.value = true;
        setTimeout(() => {
          submitButtonAnimationFail.value = false;
        }, 2000);
    }
  };
  </script>