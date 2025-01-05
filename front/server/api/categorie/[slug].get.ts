import { apiClient } from '~/utils/axiosInstance';
import { getQuery, getCookie } from 'h3';
import { TaxonSchema } from '~/types/Taxon';

export default defineEventHandler(async (event) => {

    const { slug } = event.context.params;

    if (!slug) {
      throw new Error('slug non fourni');
    }

    // Récupérez le token JWT à partir des cookies
    const authToken = getCookie(event, 'auth_token');

    const response = await apiClient.get(`/api/v2/shop/taxon-by-slug/${slug}`, {
        headers: authToken
          ? {
              Authorization: `Bearer ${authToken}`, // Ajout du token dans les en-têtes
            }
          : {},
      });

    if (response.status === 200){
        const taxon = TaxonSchema.safeParse(response.data)
        if(taxon.success){
            return{
                success: true,
                item: taxon.data
            }
        }
        else{
            return{
                success: false,
                error: {
                    title: "Une erreur est survenue lors de la récupération de la categorie"
                }
            }
        }
        
    }
    else{
        return {
            success: false,
            error: {
                title: "Une erreur est survenue lors de la récupération de la categorie"
            }
        }
    }

});
