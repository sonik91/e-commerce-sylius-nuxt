import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://sylius.localhost',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
