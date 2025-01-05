import { CartSchema } from "~/types/Cart";
import { Customer, CustomerSchema } from "~/types/Customer";
import apiClient from "~/utils/axiosInstance";

export default defineEventHandler(async (event) => {

  try{
    const body = await readBody(event)

    const tokenAuthCookie = getCookie(event, 'auth_token');

    if(!body.email){
      throw new Error('Le champ email est obligatoires.');
    }

    if(!body.localeCode){
      body.localeCode = "fr_FR"
    }


    const response = await apiClient.post(
      `/api/v2/shop/customers/reset-password`,
      {
        email: body.email,
        localeCode: body.localeCode
      },
      {
        headers: {}
      }
    );

    //si il y a une erreur
    if(response.status === 422){
      return {
        success: false,
        error: {
          title: response.data.title??'An error occured',
          detail: response.data.violations??[]
        }
      };
    }

    //creation de compte reussi
    else if(response.status === 202){
      return {
        success: true,
        error: null
      };
    }

    else{
      return {
        success: false,
        error: {
          title: response.data?.title??'An error occured',
          detail: []
        }
      }
    }


  }  catch (error: any) {
    console.error('Erreur lors de la réinitialisation du mots de passe', error.message);
    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data);
    }

    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors de la réinitialisation du mots de passe',
    };
  }
})