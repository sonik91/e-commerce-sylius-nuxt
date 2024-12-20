import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Array<{ id: number; type: string; message: string; timeout: number }>,
  }),

  actions: {
    addNotification(notification: { type: string; message: string; timeout?: number }) {
      const id = Date.now(); // Utiliser un timestamp comme ID
      const timeout = notification.timeout || 2000; // Par défaut : 5 secondes

      this.notifications.push({ id, ...notification });

      // Supprimer automatiquement la notification après `timeout`
      setTimeout(() => this.removeNotification(id), timeout);
    },

    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },
  },
});
