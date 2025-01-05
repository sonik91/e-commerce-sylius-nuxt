import { apiClient } from '~/utils/axiosInstance';
import { getQuery, getCookie } from 'h3';
import { CartSchema } from '~/types/Cart';

export default defineEventHandler(async (event) => {

    // Récupérez les paramètres de la requête
    const body = await readBody(event);

    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');

    //Récupérez le token du cart à partir des cookie
    const tokenCartCookie = getCookie(event, 'cart_token');


    interface Params {
      orderItemId: number;
      quantity: number;
      tokenValue?: string;
    }

    // Accéder aux paramètres envoyés
    let { orderItemId, quantity }: Params = body.params;

    if(!orderItemId){
        return {
            success: false,
            error: {
                title: "Le champs orderItemId est obligatoire"
            }
        }
    }

    if(!quantity){
        return {
            success: false,
            error: {
                title: "Le champs quantity est obligatoire"
            }
        }
    }

    if(!tokenCartCookie){
        return {
            success: false,
            error: {
                title: "Vous n'avez pas de panier en cour."
            }
        }
    }

    try{
        const response = await apiClient.patch(
            `/api/v2/shop/orders/${tokenCartCookie}/items/${orderItemId}`,
            {
              quantity: quantity,
            },
            {
                headers: {
                    ...(authToken && { Authorization: `Bearer ${authToken}` }), // Ajout du token si présent
                    'Content-Type': 'application/merge-patch+json', // Correct Content-Type
                },
            }
          );


        if(response.status === 422){
            return{
                success: false,
                error: {
                    title: response.data.datail??"Une erreur est survenue. Le produit n'a pas été trouver dans le panier"
                }
            }
        }

        else if (response.status === 200){

            if(!CartSchema.safeParse(response.data).success){
                return {
                    success: false,
                    error: {
                        title: "Le panier à étais mis a jours mais une erreur est survenue lors de la récuperation du panier"
                    }
                }
              }

            else{
                return {
                    success: true,
                    cart: CartSchema.safeParse(response.data).data
                }
            }

            
        }

        else{
            return{
                success: false,
                error: {
                    title: "Une erreur est survenue. Le produit n'a pas été trouver dans le panier"
                }
            }
        }


    } catch(error){
        return {
            success: false,
            error: {
                title: 'Une erreur est survenue lors de la mise a jour du panier'
            }
        }

    }
    
})