<template>
    <span>{{ formattedPrice }}</span>
</template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  
  // Définir les props du composant
  const props = defineProps<{
    amount: number; // Montant sous forme d'entier (ex: 4452 pour 44,52€)
    currency: string; // Devise sous forme de code ISO (ex: "EUR", "USD")
    locale?: string; // Locale pour la localisation, par défaut "fr-FR"
  }>();
  
  // Calcule la valeur formatée selon la devise et la locale
  const formattedPrice = computed(() => {
  return new Intl.NumberFormat(props.locale || 'fr-FR', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(props.amount / 100); // Diviser par 100 pour convertir en unités monétaires
});
  </script>