import { defineStore } from 'pinia'
import { CartSchema } from '~/types/Cart';
import type { Cart } from '~/types/Cart';
import { watch } from 'vue';
import { useNotificationStore } from '~/stores/notifications';

export const useCartStore = defineStore('cart', {
  state: (): Cart => ({
    items: [],
    customer: null,
    tokenValue: null,
    billingAddress: null,
    shippingAddress: null,
    state: '',
    currencyCode: 'EUR',
    itemsSubtotal: 0,
    itemsTotal: 0,
    localeCode: 'fr_FR',
    number: null,
    orderPromotionTotal: 0,
    paymentState: 'string',
    payments: [],
    shipments: [],
    shippingPromotionTotal: 0,
    shippingState: '',
    shippingTaxTotal: 0,
    shippingTotal: 0,
    taxExcludedTotal: 0,
    taxIncludedTotal: 0,
    taxTotal: 0,
    total: 0
  }),
  
  actions: {
    async fetchCart(cart: Cart | null = null, useApi: boolean = true) {

      const tokenCookie = useCookie('auth_token');
      const idCustomerCookie = useCookie('id_customer');

      // Si le cart n'est pas fourni ou invalide, on le récupère depuis l'API
      if ((!cart || cart === null || !CartSchema.safeParse(cart).success) && useApi) {
        const response = await $fetch<{success: boolean, error:{title: string}|null, cart:Cart|null}>('/api/cart', { method: 'GET' });

        if(!response.success){
          const notificationStore = useNotificationStore();
          notificationStore.addNotification({type:'error', message: response.error?.title?? 'Une érreur c\'est produit lors de la récuperation du panier'})
          cart = null;
        }
        else{
          cart = CartSchema.safeParse(response.cart).success ? response.cart : null;
        }
      }

      //on setup un cart valide
      const parsedCart = CartSchema.safeParse(cart || {});
      

      if(parsedCart.success){
        cart = parsedCart.data
      }
      else {
        cart = CartSchema.parse({}); // Cart par défaut
      }

      // Si le cart est valide, mettre à jour l'état
      if (cart && CartSchema.safeParse(cart).success) {

        this.items = cart.items;
        this.customer = cart.customer;
        this.tokenValue = cart.tokenValue;
        this.billingAddress = cart.billingAddress;
        this.shippingAddress = cart.shippingAddress;
        this.state = cart.state;
        this.currencyCode = cart.currencyCode;
        this.itemsSubtotal = cart.itemsSubtotal;
        this.itemsTotal = cart.itemsTotal;
        this.localeCode = cart.localeCode;
        this.number = cart.number;
        this.orderPromotionTotal = cart.orderPromotionTotal;
        this.paymentState = cart.paymentState;
        this.payments = cart.payments;
        this.shipments = cart.shipments;
        this.shippingPromotionTotal = cart.shippingPromotionTotal;
        this.shippingState = cart.shippingState;
        this.shippingTaxTotal = cart.shippingTaxTotal;
        this.shippingTotal = cart.shippingTotal;
        this.taxExcludedTotal = cart.taxExcludedTotal;
        this.taxIncludedTotal = cart.taxIncludedTotal;
        this.taxTotal = cart.taxTotal;
        this.total = cart.total;
      } else {
        console.error("Une erreur imprevue est arriver dans la mise a jour du panier");
      }
    },

    async updateQty(orderItemId: number, quantity: number = 0){
      const params = {
        orderItemId: orderItemId,
        quantity: quantity
      };

      const data = await $fetch<{success: boolean, error:{title:string}|null, cart:Cart|null}>('/api/cart/update-qty', {
        method: quantity > 0 ? 'PATCH': 'DELETE',
        body: { params }
      });

      if(quantity < 1 && data.success){
        return this.fetchCart()
      }

      
      const notificationStore = useNotificationStore();
      if(data.success && data.cart){
        const cart = data.cart as Cart
        const isValideCart = CartSchema.safeParse(cart)

        if(isValideCart.success){
          notificationStore.addNotification({type:'success', message:'cart updated'})
          await this.fetchCart(cart);
        }
        else{
          notificationStore.addNotification({type:'error', message: data.error?.title??'cart updated'})
        }
      }
      else{
        notificationStore.addNotification({type:'error', message: data.error?.title??'cart updated'})
        this.fetchCart()
      }


    },
    
    async addToCart(productVariantCode: string, quantity: number = 1) {

      const params = {
        productVariantCode: productVariantCode,
        quantity: quantity
      };

      const data = await $fetch('/api/cart/add-to-cart', {
        method: 'POST',
        body: { params }
      });

      const cart = data as Cart;

      const isValideCart = CartSchema.safeParse(cart)

      if(isValideCart.success){
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({type:'success', message:'product added to cart'})
        await this.fetchCart(cart);
      }
      else{
        console.error('error when adding product to cart');
      }
    },

    async ressetCart() {
      await this.fetchCart(CartSchema.safeParse({}).data, false);
    },

    async initCart() {
      const cart = await $fetch('/api/cart/hasCart', { method: 'GET' });
      const tokenCart = useCookie('cart_token');
      tokenCart.value = cart?.tokenValue;
      
      await this.fetchCart(cart as Cart);
    }
  }
});
