import axios from 'axios';

let baseURL;
let headers;

if (process.server && process.env.SYLIUS_BASE_URL) {
  // Logique côté serveur
  //permet avec d'utiliser le nom du container sylius car sont url ne peut pas etre résolue coté serveur
  //utile seulement pour le context docker
  baseURL = process.env.SYLIUS_BASE_URL;
  headers = {
    'Content-Type': 'application/json',
    'Host': process.env.SYLIUS_HOST || 'sylius.localhost'
  }
} else {
  // Logique côté client
  baseURL = process.env.SYLIUS_HOST || 'http://sylius.localhost';
  headers = {
    'Content-Type': 'application/json'
  }
}

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: headers
});

export default apiClient;

