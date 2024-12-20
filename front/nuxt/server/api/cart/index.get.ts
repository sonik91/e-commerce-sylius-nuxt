import { apiClient } from '~/utils/axiosInstance';
import { getCookie } from 'h3';
import { CartSchema } from '~/types/Cart';

export default defineEventHandler(async (event) => {

  

    //Récupérez le token du cart à partir des cookie
    const tokenCartCookie = getCookie(event, 'cart_token');

    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');
    
    //on verifie le panier est valide
      if(tokenCartCookie){
        try {
          const response = await apiClient.get(`/api/v2/shop/orders/${tokenCartCookie}`, {
            headers: authToken
              ? {
                  Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
                }
              : {},
          });

          if(CartSchema.safeParse(response.data).success){
            return CartSchema.safeParse(response.data).data;
          }
        } catch(error: any){
          console.error("tokenCartCookie invalide")
        }
      
      } 
    
    //on a besoin de crée un panier
    try{
      const response = await apiClient.post(`/api/v2/shop/orders`, {
        headers: authToken
          ? {
              Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
            }
          : {},
      });

      if(!CartSchema.safeParse(response.data).success){
        throw new Error('Erreur a la creation du panier');
      }

      return CartSchema.safeParse(response.data).data;
      
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout au panier:', error.message);
      if (error.response) {
        console.error('Détails de l\'erreur :', error.response.data);
      }

      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || 'Erreur lors de l\'ajout au panier:',
      };
    }
    
})