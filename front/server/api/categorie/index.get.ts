import { apiClient } from '~/utils/axiosInstance';
import { getQuery, getCookie } from 'h3';
import { TaxonSchema } from '~/types/Taxon';

export default defineEventHandler(async (event) => {

    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');

    const response = await apiClient.get('/api/v2/shop/taxons', {
        headers: authToken
          ? {
              Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
            }
          : {},
      });

    if (response.status === 200){
        const taxon = response.data['hydra:member']?.map((e) =>{
            const zod = TaxonSchema.safeParse(e || {})
            if(zod.success){
                return zod.data
            }
        })
        return{
            success: true,
            totalItems: response.data['hydra:totalItems'],
            items: taxon
        }
    }
    else{
        return {
            success: false,
            error: {
                title: "Une erreur est survenue lors de la récupération du menu"
            }
        }
    }

});
