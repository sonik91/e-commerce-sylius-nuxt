import { apiClient } from '~/utils/axiosInstance';
import { getQuery, getCookie } from 'h3';
import { Product } from '~/types/Product';
import { formatProduct } from '~/utils/FormattedProduct';

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;

    if (!slug) {
      throw new Error('ID non fourni');
    }

  try {
    // Récupérez les paramètres de la requête
    const queryParams = getQuery(event);
    
    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');

    // Appel de l'API de votre back-office
    const response = await apiClient.get(`/api/v2/shop/products-by-slug/${slug}`, {
      params: queryParams, // Passez directement les paramètres reçus
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
          }
        : {},
    });

    
    // Récupérez les données des produits et les format
    const product: Product = formatProduct(response.data)

    // Retourne les produits au frontend
    return <Product> product;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du produits :', error.message);
    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data);
    }

    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors de la récupération du produits.',
    };
  }
});