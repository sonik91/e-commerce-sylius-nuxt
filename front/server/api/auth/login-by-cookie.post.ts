import { CartSchema } from "~/types/Cart";
import { Customer, CustomerSchema } from "~/types/Customer";
import apiClient from "~/utils/axiosInstance";

export default defineEventHandler(async (event) => {

  try{

    const tokenAuthCookie = getCookie(event, 'auth_token');  
     
    const idCustomerCookie = getCookie(event, 'id_customer');   

    if(tokenAuthCookie != null && idCustomerCookie != null){
      const response = await apiClient.get(`/api/v2/shop/customers/${idCustomerCookie}`, {
        headers: {
          Authorization: `Bearer ${tokenAuthCookie}`
        },
      });

      if(response.status != 200){
        throw new Error('Erreur lors de la recuperation des info sur le client.');
      }

      const customer = {
        token: tokenAuthCookie,
        user: response.data,
        idCustomer: response.data.idCustomer
      } as Customer;

      if(!CustomerSchema.safeParse(customer).success){
        throw new Error('Erreur lors de la recuperation des info sur le client.');
      }

      return customer; 
    }

    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })

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