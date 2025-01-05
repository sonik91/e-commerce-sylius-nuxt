<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="flex flex-wrap">
          <div class="w-full md:pr-2 md:w-1/2">
            <label for="firstName" class="block text-sm/6 font-medium text-gray-900">First name</label>
            <div class="mt-2">
              <input 
              type="text" 
              name="firstName" 
              v-model="firstName"
              id="firstName" 
              autocomplete="given-name" 
              required="" 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
            <p
              role="alert"
              :class="[
                alerteContent.firstName === null || alerteContent.firstName === '' ? 'hidden' : '',
                'typography-text-base text-red-700'
              ]"
            >
              {{ alerteContent.firstName }}
            </p>
          </div>
          <div class="w-full md:pl-2 md:w-1/2">
            <label for="lastName" class="block text-sm/6 font-medium text-gray-900">Last name</label>
            <div class="mt-2">
              <input 
              type="text" 
              name="lastName" 
              v-model="lastName"
              id="lastName" 
              autocomplete="family-name" 
              required="" 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
            <p
              role="alert"
              :class="[
                alerteContent.lastName === null || alerteContent.lastName === '' ? 'hidden' : '',
                'typography-text-base text-red-700'
              ]"
            >
              {{ alerteContent.lastName }}
            </p>
          </div>
        </div>

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

        <div>
          <!-- Champ Mot de Passe -->
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <div class="relative">
              <input 
                  :type="plainPassword?'text':'password'" 
                  name="password" 
                  v-model="password"
                  id="password" 
                  autocomplete="new-password" 
                  required 
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
              />
              <button 
                  tabindex="-1"
                  @click="plainPassword = !plainPassword"
                  type="button" 
                  :class="[plainPassword ? 'text-blue-600 dark:text-blue-500' : 'dark:text-neutral-600 text-gray-400', 'absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md']"
              >
                <!-- Icône pour afficher/masquer -->
                <svg class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path :class="[plainPassword ? 'hidden' : 'block']" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path :class="[plainPassword ? 'hidden' : 'block']" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path :class="[plainPassword ? 'hidden' : 'block']" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line :class="[plainPassword ? 'hidden' : 'block']" x1="2" x2="22" y1="2" y2="22"></line>
                  <path :class="[!plainPassword ? 'hidden' : 'block']" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle :class="[!plainPassword ? 'hidden' : 'block']" cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <p
              role="alert"
              :class="[
                alerteContent.password === null || alerteContent.password === '' ? 'hidden' : '',
                'typography-text-base text-red-700'
              ]"
            >
              {{ alerteContent.password }}
            </p>
          </div>

          <!-- Champ Confirmation de Mot de Passe -->
          <div class="mt-4">
            <div class="flex items-center justify-between">
              <label for="confirm-password" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
            </div>
            <div class="mt-2">
              <div class="relative">
                <input 
                    :type="plainConfirmPassword?'text':'password'" 
                    name="confirm-password" 
                    v-model="confirmPassword"
                    id="confirm-password" 
                    autocomplete="new-password"
                    required 
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
                />
                <button 
                    tabindex="-1"
                    @click="plainConfirmPassword = !plainConfirmPassword"
                    type="button" 
                    :class="[plainConfirmPassword ? 'text-blue-600 dark:text-blue-500' : 'dark:text-neutral-600 text-gray-400', 'absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md']"
                >
                  <!-- Icône pour afficher/masquer -->
                  <svg class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path :class="[plainConfirmPassword ? 'hidden' : 'block']" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path :class="[plainConfirmPassword ? 'hidden' : 'block']" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path :class="[plainConfirmPassword ? 'hidden' : 'block']" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line :class="[plainConfirmPassword ? 'hidden' : 'block']" x1="2" x2="22" y1="2" y2="22"></line>
                    <path :class="[!plainConfirmPassword ? 'hidden' : 'block']" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle :class="[!plainConfirmPassword ? 'hidden' : 'block']" cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            <p
              role="alert"
              :class="[
                alerteContent.confirmPassword === null || alerteContent.confirmPassword === '' ? 'hidden' : '',
                'typography-text-base text-red-700'
              ]"
            >
              {{ alerteContent.confirmPassword }}
            </p>
          </div>

          <!-- Message d'erreur -->
          <div v-if="password && confirmPassword && password !== confirmPassword" class="mt-2 text-sm text-red-600">
            Passwords do not match.
          </div>
        </div>

        <div class="flex">
            <input 
            type="checkbox" 
            name="subscribedToNewsletter" 
            v-model="subscribedToNewsletter"
            id="subscribedToNewsletter" 
            class="block rounded-md " />
          <label for="subscribedToNewsletter" class="ml-3 block text-sm/6 font-medium text-gray-900">Suscribe to newsletter</label>
        </div>
        <p
          role="alert"
          :class="[
            alerteContent.subscribedToNewsletter === null || alerteContent.subscribedToNewsletter === '' ? 'hidden' : '',
            'typography-text-base text-red-700'
          ]"
        >
          {{ alerteContent.subscribedToNewsletter }}
        </p>

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
            Create account
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

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const plainPassword = ref(false);
const confirmPassword = ref('');
const plainConfirmPassword = ref(false); 
const subscribedToNewsletter = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const alerteContent = ref({
  global: "",
  success: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  subscribedToNewsletter: ""
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      subscribedToNewsletter: ""
    };
    const response = await authStore.create({ firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value, subscribedToNewsletter: subscribedToNewsletter.value });
      
    //si une erreur c'est produite
    if(!response.success){
      const titleError = response.error?.title??'Une erreur est survenue lors de la création de votre compte'
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

    // Vérifie si `redirect` est présent dans l'URL
    if(authStore.isAuthenticated === true){
      const redirect = router.currentRoute.value.query.redirect || '/';
      router.push(redirect);
    }
    else if(response.success){
      alerteContent.value.success = `Votre compte à été crée avec succes. veuillez verrifier votre compte. un mail vous à était envoyer à ${email.value}`;
    }
    else{
      throw new Error('Erreur lors de la connexion. Identifiant incorecte');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alerteContent.value.global = "Une erreur est survenue lors de la création de votre compte."
    submitButtonAnimationFail.value = true;
      setTimeout(() => {
        submitButtonAnimationFail.value = false;
      }, 2000);
  }
};
</script>