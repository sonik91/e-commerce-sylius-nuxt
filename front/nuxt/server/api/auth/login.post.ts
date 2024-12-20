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

    if(!body.password){
      throw new Error('Le champ password est obligatoires.');
    }

    // Appel de l'API de votre back-office
    const response = await apiClient.post(
      `/api/v2/shop/customers/token`,
      {
        email: body.email,
        password: body.password,
      },
      {
        headers: {},
      }
    );

    if(response.data.token && response.data.customer){
      const responseUser = await apiClient.get(`${response.data.customer}`, {
        headers:{
              Authorization: `Bearer ${response.data.token}`, // Ajout du token dans les en-têtes
            }
      });
      
      if(responseUser.status != 200){
        throw new Error('Erreur lors de la recuperation des info sur le client.');
      }

      const customer = {
        token: response.data.token,
        user: responseUser.data,
        idCustomer: responseUser.data.idCustomer
      } as Customer;

      

      if(!CustomerSchema.safeParse(customer).success){
        throw new Error('Erreur lors de la recuperation des info sur le client.');
      }

      return customer;
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