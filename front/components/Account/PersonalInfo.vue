<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Informations personnelles</h2>

    <form @submit.prevent="updatePersonalInfo" class="space-y-4">
      <div>
        <label for="gender" class="block text-sm font-medium text-gray-700">Sexe</label>
        <input
          type="text"
          id="gender"
          v-model="formData.gender"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
        <input
          type="text"
          id="firstName"
          required
          v-model="formData.firstName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          id="lastName"
          required
          v-model="formData.lastName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="birthday" class="block text-sm font-medium text-gray-700">Date de naissance</label>
        <input
          type="text"
          id="birthday"
          v-model="formData.birthday"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          disabled
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Téléphone</label>
        <input
          type="phone"
          id="phoneNumber"
          v-model="formData.phoneNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="subscribedToNewsletter" class="block text-sm font-medium text-gray-700">S'inscrire a la newsletter</label>
        <input
          type="checkbox"
          id="subscribedToNewsletter"
          v-model="formData.subscribedToNewsletter"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Mettre à jour
        </button>
      </div>
    </form>

    <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
    <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const formData = ref({
  gender: '',
  firstName: '',
  lastName: '',
  email: '',
  birthday: '',
  phoneNumber: '',
  subscribedToNewsletter: false
});

const successMessage = ref('');
const errorMessage = ref('');

const fetchPersonalInfo = async () => {
  try {
    formData.value = {
      defaultAddress: authStore.user.defaultAddress,
      gender: authStore.user.gender,
      firstName: authStore.user.firstName,
      lastName: authStore.user.lastName,
      email: authStore.user.email,
      birthday: authStore.user.birthday,
      phoneNumber: authStore.user.phoneNumber,
      subscribedToNewsletter: authStore.user.subscribedToNewsletter,
      idCustomer: authStore.user.idCustomer
    };
  } catch (error) {
    console.error('Erreur lors du chargement des informations personnelles:', error);
    errorMessage.value = 'Impossible de charger vos informations personnelles.';
  }
};

const updatePersonalInfo = async () => {
  try {
    await useFetch('/api/auth/update-customer', {
      method: 'PUT',
      body: formData.value,
    });
    successMessage.value = 'Vos informations ont été mises à jour avec succès.';
    errorMessage.value = '';
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations personnelles:', error);
    errorMessage.value = 'Impossible de mettre à jour vos informations.';
    successMessage.value = '';
  }
};

onMounted(() => {
  fetchPersonalInfo();
});
</script>

