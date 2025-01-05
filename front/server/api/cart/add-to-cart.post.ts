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
      productVariantCode: string;
      quantity: number;
      tokenValue?: string;
    }

    // Accéder aux paramètres envoyés
    let { productVariantCode, quantity }: Params = body.params;

    if (!productVariantCode || !quantity) {
      throw createError({
        statusCode: 404,
        message: 'Les champs productVariantCode et quantity sont obligatoires.'
      })
    }

    let tokenValue = null;

    //on verifie le panier est valide
    if(tokenCartCookie){
      try{
        const response = await apiClient.get(`/api/v2/shop/orders/${tokenCartCookie}`, {
          headers: authToken
            ? {
                Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
              }
            : {},
        });

        if(CartSchema.safeParse(response.data).success){
          tokenValue = tokenCartCookie;
        }
      } catch(error: any){
        console.error('Le token du cart est invalide')
      }
    }

    if(!tokenValue){
      try{
        //on a besoin de crée un panier
        const response = await apiClient.post(`/api/v2/shop/orders`, {
          headers: authToken
            ? {
                Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
              }
            : {},
        });

        if(!response.data.tokenValue){
          throw new Error('Erreur lors de la creation du panier');
        }
        tokenValue = response.data.tokenValue;
      } catch(error: any){
        throw createError({
          statusCode: 404,
          message: 'imposible de crée le panier'
        })
      }
    }   

    // Appel de l'API de votre back-office
    try{
    const response = await apiClient.post(
      `/api/v2/shop/orders/${tokenValue}/items`,
      {
        productVariant: productVariantCode,
        quantity: quantity,
      },
      {
        headers: authToken
          ? {
              Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
            }
          : {},
      }
    );

    if(!CartSchema.safeParse(response.data).success){
      throw new Error('Erreur lors de l\'ajout au panier');
    }

    return CartSchema.safeParse(response.data).data;
    } catch(error: any){
      throw createError({
        statusCode: 404,
        message: 'imposible d\'ajouter le produit au panier'
      })
    }
    
})