import { defineStore } from 'pinia'
import { CustomerSchema, type Customer } from '~/types/Customer';

export const useAuthStore = defineStore('auth', {
  state: (): Customer => ({
    user: null,
    token: null,
    idCustomer: null
  }),
  
  actions: {
    async login(params: {email: string, password: string} ) {
    
      const {email, password} = params;

      const { data } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      // Charger le token depuis le cookie
      const tokenCookie = useCookie('auth_token');
      const idCustomerCookie = useCookie('id_customer');

      if(CustomerSchema.safeParse(data.value).success){
        this.token = data.value.token;
        this.user = data.value.user;
        this.idCustomer = data.value.idCustomer;

        tokenCookie.value = data.value.token;
        idCustomerCookie.value = data.value.idCustomer;        
      }

      else{
        //si on a pas put ce connecter alors on remet tous a 0
        this.token = null;
        this.user = null;
        this.idCustomer = null;

        tokenCookie.value = null;
        idCustomerCookie.value = null;
      }


    },
    
    logout() {
      this.user = null
      this.token = null
      this.idCustomer = null;

      // Supprimer les cookies
      const tokenCookie = useCookie('auth_token');
      tokenCookie.value = null;

      const idCustomerCookie = useCookie('id_customer');
      idCustomerCookie.value = null;
      
      const cartTokenCookie = useCookie('cart_token');
      cartTokenCookie.value = null;
    },

    async loadFromCookies() {
      // Charger le token depuis le cookie
      const tokenCookie = useCookie('auth_token');
      const idCustomerCookie = useCookie('id_customer');

      if (tokenCookie.value && idCustomerCookie.value) {
        const { data } = await useFetch('/api/auth/login-by-cookie', {
          method: 'POST'
        });

        if(CustomerSchema.safeParse(data.value).success){
          this.token = data.value.token;
          this.user = data.value.user;
          this.idCustomer = data.value.idCustomer;

          tokenCookie.value = data.value.token;
          idCustomerCookie.value = data.value.idCustomer
          return;
        }
      }

      //si on a pas put ce connecter alors on remet tous a 0
      this.token = null;
      this.user = null;
      this.idCustomer = null;

      tokenCookie.value = null;
      idCustomerCookie.value = null;
    },

  },
  
  getters: {
    isAuthenticated: (state) => !!state.token
  }
})