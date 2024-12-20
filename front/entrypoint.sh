#!/bin/bash

# Mise à jour de npm et installation globale de nuxi
npm install -g npm@11.0.0 --yes
npm install -g nuxi --yes

# Vérifie si le volume est vide
if [ -z "$(ls -A /var/www/html)" ]; then

    echo "Initialisation du volume avec Nuxt..."
    
    # Initialisation temporaire dans /usr/src
    cd /usr/src
    npx nuxi init --package-manager=npm --git-init=false storefront-ui-project
    cd storefront-ui-project
    
    # Installation des dépendances
    npm install --yes
    npm install -D @storefront-ui/nuxt --yes

    # Configuration de Nuxt
    sed -i "/export default defineNuxtConfig({/a\ \ \ modules: ['@storefront-ui/nuxt']," nuxt.config.ts
    

    # Configuration de Tailwind CSS
    cat <<EOT > tailwind.config.js
import type { Config } from 'tailwindcss';

export default <Config>{
  content: ['./**/*.vue'],
};
EOT

    # Création des fichiers CSS nécessaires
    mkdir -p assets/css
    cat <<EOT > assets/css/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOT

    #mise en place de orval pour faire la jonction entre l'api de sylius et le front
    npm i -D orval

    cat <<EOT > orval.config.ts
export default {
    syliusApi: {
      input: 'export_api.json', // Chemin vers le fichier OpenAPI (exporté depuis Sylius)
      output: {
        target: './services/api/generated.ts', // Chemin pour le fichier TypeScript généré
        client: 'axios', // Utilisation d'Axios pour les requêtes
        override: {
          mutator: {
            path: './services/api/customAxiosInstance.ts', // Instance Axios personnalisée
            name: 'customAxiosInstance', // Nom de la fonction mutator
          },
          operations: {
            '*': {
              // Vous pouvez ajouter des configurations spécifiques pour chaque endpoint si nécessaire
            },
          },
        },
        mock: false, // Désactiver les mocks (optionnel, utile en développement)
      },
    },
  };
EOT

    mkdir -p services/api

    cat << EOT > customAxiosInstance.ts
import Axios, { type AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'sylius.localhost',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT si nécessaire
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token'); // Exemple pour récupérer un token JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customAxiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customAxiosInstance;
EOT

    # Déplacement des fichiers générés vers /var/www/html
    mv /usr/src/storefront-ui-project/* /var/www/html/
    mv /usr/src/storefront-ui-project/.[!.]* /var/www/html/ 2>/dev/null || true
    chown -R www-data:www-data /var/www/html

    # Nettoyage du dossier temporaire
    rm -rf /usr/src/storefront-ui-project
    cd /var/www/html/
fi


# Lancer le serveur Nuxt
npm run dev &

# Lancer Apache en mode foreground
exec apache2-foreground
