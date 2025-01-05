<template>
    <div class="container max-w-6xl mx-auto px-4 py-8 flex flex-wrap sm:flex-nowrap gap-5">
      <!-- Sidebar avec les onglets -->
      <nav class="w-full sm:w-1/4 bg-gray-100 rounded-lg p-4">
        <ul class="space-y-4">
          <li
            v-for="tab in tabs"
            :key="tab.name"
            :class="[
              'cursor-pointer p-3 rounded-lg text-gray-700 font-semibold',
              activeTab === tab.name
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200'
            ]"
            @click="setActiveTab(tab.name)"
          >
            {{ tab.label }}
          </li>
        </ul>
      </nav>
  
      <!-- Contenu des onglets -->
      <div class="w-full sm:w-3/4 bg-white rounded-lg p-6 shadow-md">
        <component :is="activeComponent" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import PersonalInfo from '~/components/Account/PersonalInfo.vue';
  import UpdatePassword from '~/components/Account/UpdatePassword.vue';
  import Address from '~/components/Account/Address.vue';
  import Order from '~/components/Account/Order.vue';

  definePageMeta({
    requiresAuth: true, // Indique que cette page nécessite une authentification
  })
  
  // Déclaration des onglets et composants associés
  const tabs = [
    { name: 'personalInfo', label: 'Informations Personnelles', component: PersonalInfo },
    { name: 'updatePAssword', label: 'Changer votre mots de passe', component: UpdatePassword },
    { name: 'address', label: 'Mes addresse', component: Address },
    { name: 'order', label: 'Mes commande', component: Order }
  ];
  
  const activeTab = ref(tabs[0].name);
  
  // Calcul du composant actif
  const activeComponent = computed(() => {
    const active = tabs.find(tab => tab.name === activeTab.value);
    console.log(active ? active.component : null)
    return active ? active.component : null;
  });
  
  // Change l'onglet actif
  const setActiveTab = (tabName) => {
    activeTab.value = tabName;
  };
  </script>
  