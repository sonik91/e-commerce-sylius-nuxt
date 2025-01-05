import { CartSchema } from "~/types/Cart";
import { Customer, CustomerSchema } from "~/types/Customer";
import apiClient from "~/utils/axiosInstance";

export default defineEventHandler(async (event) => {

  try{
    const body = await readBody(event)

    const tokenAuthCookie = getCookie(event, 'auth_token');

    if(!body.idCustomer){
      throw new Error('Le champ idCustomer est manquant.');
    }

    // Appel de l'API de votre back-office
    const response = await apiClient.put(
      `/api/v2/shop/customers/${body.idCustomer}`,
      {
        defaultAddress: body.defaultAddress,
        gender: body.gender,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        birthday: body.birthday,
        phoneNumber: body.phoneNumber,
        subscribedToNewsletter: body.subscribedToNewsletter,
      },
      {
        headers:{
          Authorization: `Bearer ${tokenAuthCookie}`, // Ajout du token dans les en-têtes
        }
      }
    );

    if(response.status === 401){
      return {
        succes: false,
        error: response.data
      }
    }

    if(response.status === 200){
      return{
        succes: true,
        user: response.data
      }
    }

    else{
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
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