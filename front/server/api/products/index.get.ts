import { apiClient } from '~/utils/axiosInstance';
import { getQuery, getCookie } from 'h3';
import { Product } from '~/types/Product';
import { formatProduct } from '~/utils/FormattedProduct';

export default defineEventHandler(async (event) => {
  try {
    // Récupérez les paramètres de la requête et force le parametre enabled a true pour ne jamais afficher les produit desactiver
    const queryParams = { onlyTotalItems: false, ...getQuery(event), enabled: true };
    if(queryParams.taxon??false){
      queryParams['productTaxons.taxon.code'] = queryParams.taxon;
      delete queryParams.taxon;
    }

    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');

    // Appel de l'API de votre back-office
    const response = await apiClient.get('/api/v2/shop/products', {
      params: queryParams, // Passez directement les paramètres reçus
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
          }
        : {},
    });

    const totalItems = response.data['hydra:totalItems']??null;

    // Récupérez les données des produits et les format
    const products: Product[] = response.data['hydra:member']?.map((product: any) => {

      return <Product> formatProduct(product);
    });

    // Retourne les produits au frontend
    return {
      totalItems: totalItems,
      status: response.status,
      products: products
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error.message);
    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data);
    }

    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors de la récupération des produits.',
    };
  }
});
