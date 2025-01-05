import { CartSchema } from "~/types/Cart";
import { Customer, CustomerSchema } from "~/types/Customer";
import apiClient from "~/utils/axiosInstance";
import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export default defineEventHandler(async (event) => {

  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  let response

  try{
    //on ce connecte pour recupere le token
    response = await apiClient.post(
      `/api/v2/shop/customers/token`,
      {
        email: email,
        password: password,
      },
      {
        headers: {},
      }
    );

    //les identifiant sont incorecte
    if(response.status === 401){
      throw createError({
        statusCode: response.status,
        message: 'identifiant incorrecte'
      })
    }

    //autre soucis de connexion avec le backoffice
    if(response.status != 200 || !(response.data.token && response.data.customer)){
      throw createError({
        statusCode: response.status,
        message: 'Une erreur c\'est produit lors de la connexion'
      })
    }

    const responseUser = await apiClient.get(`${response.data.customer}`, {
      headers:{
            Authorization: `Bearer ${response.data.token}`, // Ajout du token dans les en-têtes
          }
    });

    //les identifiant sont incorecte
    if(response.status != 200){
      throw createError({
        statusCode: responseUser.status,
        message: 'Une erreur c\'est produit lors de la recuperation des informations du client'
      })
    }

    const customer = CustomerSchema.safeParse({
      idCustomer:responseUser.data.idCustomer, 
      token: response.data.token,
      shortName: responseUser.data.firstName.charAt(0).toUpperCase() + '.' + responseUser.data.lastName,
      verified: responseUser.data.user.verified
    })

    if(!customer.success){
      throw createError({
        statusCode: 500,
        message: 'Une erreur c\'est produit lors de la recuperation des informations du client car le format de retour n\'est pas bon'
      })
    }

    await setUserSession(event, {
      user: customer.data
    })

    return {
      success: true
    }

  } catch(err:any){
    return {
      success: false,
      error: {
        title: err?.message?? "identifiant incorrecte"
      }
    }
  }



/*

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

    if(response.status === 401){
      return {
        succes: false,
        error: response.data
      }
    }

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
    */
})