<template>
    <div class="fixed z-50 bottom-4 right-4 space-y-4" v-if="notifications?.length">
        <div
            v-for="notification in notifications"
            :key="notification.id"
            role="alert"
            :class="[
                'flex items-start md:items-center max-w-[600px] shadow-md bg-positive-100 pr-2 pl-4 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md',
                notification.type === 'success'?'bg-green-500':'',
                notification.type === 'error' ? 'bg-red-500':'',
                notification.type === 'info' ? 'bg-blue-500': '',
            ]"
        >
            <SfIconCheckCircle class="my-2 mr-2 text-positive-700 shrink-0" />
            <p class="py-2 mr-2">{{ notification.message }}</p>
            <button
                type="button"
                class="p-1.5 md:p-2 ml-auto rounded-md text-positive-700 hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900 focus-visible:outline focus-visible:outline-offset"
                aria-label="Close positive alert"
                @click="notificationStore.removeNotification(notification.id)" 
            >
                <SfIconClose class="hidden md:block" />
                <SfIconClose size="sm" class="block md:hidden" />
            </button>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { SfIconCheckCircle, SfIconClose } from '@storefront-ui/vue';
import { computed } from 'vue';
  import { useNotificationStore } from '~/stores/notifications';
  
  const notificationStore = useNotificationStore();
  const notifications = computed(()=>notificationStore.notifications);
  </script>
  
  