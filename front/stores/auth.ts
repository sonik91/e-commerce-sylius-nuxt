import { defineStore } from 'pinia';
import { watch } from 'vue';
import { CustomerSchema, type Customer } from '~/types/Customer';
import { useCartStore } from '~/stores/cart';

export const useAuthStore = defineStore('auth', {
  state: (): Customer => ({
    user: null,
    token: null,
    idCustomer: null
  }),
  
  actions: {
    async create(params: {firstName: string, lastName: string, email: string, password: string, subscribedToNewsletter: boolean}){
      const {firstName, lastName, email, password, subscribedToNewsletter} = params;

      const { data } = await useFetch<{success:boolean, error:({title:string,detail:Array<any>}|null)}>('/api/auth/create-account', {
        method: 'POST',
        body: {firstName, lastName, email, password, subscribedToNewsletter}
      })

      //la creation à echouer
      if(!data.value.success){
        return {
          success: false,
          error:data.value.error??{title:"An error occured", detail:[]}
        }
      }
      else{
        await this.login({email: email, password: password})
        if(this.token !== null){
          return {
            success: true
          }
        }
        else{
          return{
            success: false,
            error: {
              title: "your acount is create but an error occured when connect your account. please try connect on login page or contact support",
              error: []
            }
          }
        }
      }
    },

    async login(params: {email: string, password: string} ) {
    
      const {email, password} = params;

      const { data } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if(CustomerSchema.safeParse(data.value).success){
        this.token = data.value.token;
        this.user = data.value.user;
        this.idCustomer = data.value.idCustomer;

      }

      else{
        //si on a pas put ce connecter alors on remet tous a 0
        this.token = null;
        this.user = null;
        this.idCustomer = null;
      }

      useCartStore().fetchCart();


    },

    async resetPassword(params: {email: string, localeCode: string}){
      const {email, localeCode} = params;

      const { data } = await useFetch('/api/auth/reset-password', {
        method: 'POST',
        body: { email, localeCode }
      })


      if(!data.value.success){
        return {
          success: false,
          error:data.value.error??{title:"An error occured", detail:[]}
        }
      }
      
      else{
        return {
          success: true
        }
      }

    },
    
    async logout() {
      this.user = null
      this.token = null
      this.idCustomer = null;

      useCartStore().ressetCart();
    },

    async loadFromCookies() {
      // Charger le token depuis le cookie
      const tokenCookie = useCookie('auth_token')??null;
      const idCustomerCookie = useCookie('id_customer')??null;

      if (tokenCookie.value && idCustomerCookie.value) {
        const { data } = await useFetch('/api/auth/login-by-cookie', {
          method: 'POST'
        });

        if(CustomerSchema.safeParse(data.value).success){
          this.token = data.value.token;
          this.user = data.value.user;
          this.idCustomer = data.value.idCustomer;

          //on set le cookie dans le même état
          tokenCookie.value  = this.token
          idCustomerCookie.value = this.idCustomer?.toString()
          return;
        }
      }

      //si on a pas put ce connecter alors on remet tous a 0
      this.token = null;
      this.user = null;
      this.idCustomer = null;

      //on set le cookie dans le même état
      tokenCookie.value  = this.token
      idCustomerCookie.value = this.idCustomer

    },

  },
  
  getters: {
    isAuthenticated: (state) => !!state.token
  }
})