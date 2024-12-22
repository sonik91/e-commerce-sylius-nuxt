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

          //on renvoie le cart si il est valide
          if(CartSchema.safeParse(response.data).success){
            return CartSchema.safeParse(response.data).data;
          }
        } catch(error: any){
          console.error("tokenCartCookie invalide")
        }
      
      } 

      //si pas de cart on renvoie un cart vide
      return CartSchema.safeParse({}).data;
    
})