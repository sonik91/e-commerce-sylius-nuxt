import { CartSchema } from "~/types/Cart";
import { Customer, CustomerSchema } from "~/types/Customer";
import apiClient from "~/utils/axiosInstance";

export default defineEventHandler(async (event) => {

  try{
    const body = await readBody(event)

    const tokenAuthCookie = getCookie(event, 'auth_token');

    if(!body.firstName){
      throw new Error('Le champ firstName est obligatoires.');
    }

    if(!body.lastName){
      throw new Error('Le champ lastName est obligatoires.');
    }

    if(!body.email){
      throw new Error('Le champ email est obligatoires.');
    }

    if(!body.password){
      throw new Error('Le champ password est obligatoires.');
    }


    const response = await apiClient.post(
      `/api/v2/shop/customers`,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        subscribedToNewsletter: body.subscribedToNewsletter?? false
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
    else if(response.status === 204){
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
    console.error('Erreur lors de la connexion', error.message);
    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data);
    }

    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors de la connexion',
    };
  }
})