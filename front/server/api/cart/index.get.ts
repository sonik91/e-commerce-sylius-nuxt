import { apiClient } from '~/utils/axiosInstance';
import { getQuery, getCookie } from 'h3';
import { Product } from '~/types/Product';
import { formatProduct } from '~/utils/FormattedProduct';
import { CartSchema } from '~/types/Cart';

export default defineEventHandler(async (event) => {
  try {
    // Récupérez les paramètres de la requête et force le parametre enabled a true pour ne jamais afficher les produit desactiver
    const queryParams = { onlyTotalItems: false, ...getQuery(event), enabled: true };

    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');
    const cartToken = getCookie(event, 'cart_token');

    if(!cartToken){
      return {
        success: false,
        error:{
          title: "missing cartToken"
        }
      }
    }

    // Appel de l'API de votre back-office
    const response = await apiClient.get(`/api/v2/shop/orders/${cartToken}`, {
      params: queryParams, // Passez directement les paramètres reçus
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
          }
        : {},
    });

    if(response.status === 200 && CartSchema.safeParse(response.data).success) {
      //si on veut que le total de produit
      if(queryParams.onlyTotalItems){
        return response.data['hydra:totalItems']??null
      }

      return {
        success: true,
        cart: CartSchema.safeParse(response.data).data

      }
    }

    else{
      return{
        success: false,
        title: response.data.message ?? "Une erreur c'est produite lors de la récuperation du panier"
      }
    }

  } catch (error) {
    console.error('Erreur lors de la récupération du panier :', error.message);
    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data);
    }

    return {
      success: false,
      statusCode: error.response?.status || 500,
      title: error.response?.data?.message || 'Erreur lors de la récupération du panier.',
    };
  }
});
