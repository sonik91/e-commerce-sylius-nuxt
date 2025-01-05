<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
  <div class="w-full h-full z-10">
    <header ref="referenceRef" class="relative">
      <div
        class="flex justify-between items-center flex-wrap md:flex-nowrap px-4 md:px-10 py-2 md:py-5 w-full h-full border-0 bg-primary-700 border-neutral-200 md:h-20 md:z-10"
      >
        <div class="flex items-center">
          <SfButton
            variant="tertiary"
            square
            aria-label="Close menu"
            class="block md:hidden mr-5 bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
            @click="openMenu([])"
          >
            <SfIconMenu class="text-white" />
          </SfButton>
          <NuxtLink
            to="/"
            aria-label="SF Homepage"
            class="flex shrink-0 w-8 h-8 lg:w-[12.5rem] lg:h-[1.75rem] items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
          >
            <picture>
              <source srcset="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/vsf_logo_white.svg" media="(min-width: 1024px)" />
              <img src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/vsf_logo_sign_white.svg" alt="Sf Logo" />
            </picture>
          </NuxtLink>
        </div>
        <form role="search" class="hidden md:flex flex-[100%] ml-10" @submit.prevent="search">
          <SfInput
            v-model="inputValue"
            type="search"
            class="[&::-webkit-search-cancel-button]:appearance-none"
            placeholder="Search"
            wrapper-class="flex-1 h-10 pr-0"
            size="base"
          >
            <template #suffix>
              <span class="flex items-center">
                <SfButton
                  variant="tertiary"
                  square
                  aria-label="search"
                  type="submit"
                  class="rounded-l-none hover:bg-transparent active:bg-transparent"
                >
                  <SfIconSearch />
                </SfButton>
              </span>
            </template>
          </SfInput>
        </form>
        <nav class="flex flex-nowrap justify-end items-center md:ml-10 gap-x-1">
          <SfButton
            v-for="actionItem in actionItems"
            :key="actionItem.ariaLabel"
            :aria-label="actionItem.ariaLabel"
            class="text-white relative bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
            variant="tertiary"
            square
            @click="actionItem.onClick && actionItem.onClick()"
          >
            <template #prefix>
              <Component :is="actionItem.icon" />
            </template>
            <span 
              v-if="actionItem.numberItems" 
              :class="[
                actionItem.numberItems > 0 ? 'flex' : 'none',
                'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 items-center justify-center'
                ]"
              >
                {{ actionItem.numberItems }}
              </span>
            <p v-if="actionItem.role === 'login'" class="hidden lg:inline-flex whitespace-nowrap mr-2">
              {{ actionItem.label }}
            </p>
          </SfButton>
        </nav>
        <form role="search" class="flex md:hidden flex-[100%] my-2" @submit.prevent="search">
          <SfInput
            v-model="inputValue"
            type="search"
            class="[&::-webkit-search-cancel-button]:appearance-none"
            placeholder="Search"
            wrapper-class="flex-1 h-10 pr-0"
            size="base"
          >
            <template #suffix>
              <span class="flex items-center">
                <SfButton
                  variant="tertiary"
                  square
                  aria-label="search"
                  type="submit"
                  class="rounded-l-none hover:bg-transparent active:bg-transparent"
                >
                  <SfIconSearch />
                </SfButton>
              </span>
            </template>
          </SfInput>
        </form>
      </div>
      <!-- Desktop dropdown -->
      <nav ref="floatingRef">
        <ul
          class="hidden md:flex px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid"
          @blur="
            (event) => {
              if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
                close();
              }
            }
          "
        >
          <li v-for="(menuNode, index) in content.children" :key="menuNode.code">
            <SfButton
              ref="triggerRefs"
              variant="tertiary"
              class="group mr-2 !text-neutral-900 hover:!bg-neutral-200 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900"
              @mouseenter="!menuNode.isLeaf ? openMenu([menuNode.code]) : openMenu([''])"
              @click="menuNode.isLeaf ? router.push(pageCategoryBaseUrl + menuNode.slug) : openMenu([menuNode.code])"
            >
              <span>{{ menuNode.name }}</span>
              <SfIconChevronRight
                v-if='!menuNode.isLeaf'
                class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
              />
            </SfButton>

            <div
              v-if="isOpen && activeNode.length === 1 && activeNode[0] === menuNode.code"
              :key="activeMenu.code"
              ref="megaMenuRef"
              :style="style"
              class="hidden md:grid gap-x-6 grid-cols-4 bg-white shadow-lg p-6 left-0 right-0 outline-none"
              tabindex="0"
              @mouseleave="close()"
              @keydown.esc="focusTrigger(index)"
            >
              <template v-for="node in activeMenu.children" :key="node.code">
                <template v-if="node.isLeaf">
                  <SfListItem tag="a" size="sm" :href="pageCategoryBaseUrl + node.slug" class="typography-text-sm mb-2">
                    {{ node.name }}
                  </SfListItem>
                  <div class="col-start-2 col-end-5" />
                </template>
                <div v-else>
                  <p
                    class="typography-text-base font-medium text-neutral-900 whitespace-nowrap px-4 py-1.5 border-b border-b-neutral-200 border-b-solid"
                  >
                    {{ node.name }}
                  </p>
                  <ul class="mt-2">
                    <li v-for="child in node.children" :key="child.code">
                      <SfListItem tag="a" size="sm" :href="pageCategoryBaseUrl + child.slug" class="typography-text-sm py-1.5">
                        {{ child.name }}
                      </SfListItem>
                    </li>
                  </ul>
                </div>
              </template>
              <div
                v-if="bannerNode.images && Array.isArray(bannerNode.images) && bannerNode.images.find(item => item.type === 'banner')?.path"
                class="flex flex-col items-center justify-center overflow-hidden rounded-md bg-neutral-100 border-neutral-300 grow"
              >
                <img :src="bannerNode.images.find(item => item.type === 'banner').path" :alt="bannerNode.bannerTitle??''" class="object-contain" />
                <p class="px-4 mt-4 mb-4 font-medium text-center typography-text-base">
                  {{ bannerNode.bannerTitle??'' }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Mobile drawer -->
      <div v-if="isOpen" class="md:hidden fixed inset-0 bg-neutral-500 bg-opacity-50" />
      <SfDrawer
        ref="drawerRef"
        v-model="isOpen"
        placement="left"
        class="md:hidden right-[50px] max-w-[376px] bg-white overflow-y-auto"
      >
        <nav>
          <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid">
            <p class="typography-text-base font-medium">Browse products</p>
            <SfButton variant="tertiary" square aria-label="Close menu" class="ml-2" @click="close()">
              <SfIconClose class="text-neutral-500" />
            </SfButton>
          </div>
          <ul class="mt-2 mb-6">
            <li v-if="activeMenu.code !== 'root'">
              <SfListItem
                size="lg"
                tag="button"
                type="button"
                class="border-b border-b-neutral-200 border-b-solid"
                @click="goBack()"
              >
                <div class="flex items-center">
                  <SfIconArrowBack class="text-neutral-500" />
                  <p class="ml-5 font-medium">{{ activeMenu.name }}</p>
                </div>
              </SfListItem>
            </li>
            <template v-for="node in activeMenu.children" :key="node.name">
              <li v-if="node.isLeaf">
                <SfListItem size="lg" tag="a" :href="pageCategoryBaseUrl + node.slug" class="first-of-type:mt-2">
                  <div class="flex items-center">
                    <p class="text-left">{{ node.name }}</p>
                  </div>
                </SfListItem>
              </li>
              <li v-else>
                <SfListItem size="lg" tag="button" type="button" @click="goNext(node.code)">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <p class="text-left">{{ node.name }}</p>
                    </div>
                    <SfIconChevronRight class="text-neutral-500" />
                  </div>
                </SfListItem>
              </li>
            </template>
          </ul>
          <div
            v-if="bannerNode.images && Array.isArray(bannerNode.images) && bannerNode.images.find(item => item.type === 'banner')?.path"
            class="flex items-center overflow-hidden bg-neutral-100 border-neutral-300 grow"
          >
            <img
              :src="bannerNode.images.find(item => item.type === 'banner')?.path"
              :alt="bannerNode.bannerTitle??''"
              class="object-contain w-[50%] basis-6/12"
            />
            <p class="basis-6/12 p-6 font-medium typography-text-base">{{ bannerNode.bannerTitle??'' }}</p>
          </div>
        </nav>
      </SfDrawer>
      <!-- Cart Modal -->
      <CartModal 
        :is-open="isCartOpen"
        @close="isCartOpen = false"
      />
    </header>
  </div>
</template>

<script lang="ts" setup>
  import {
    SfIconShoppingCart,
    SfIconFavorite,
    SfIconPerson,
    SfIconClose,
    SfButton,
    SfDrawer,
    SfListItem,
    SfIconChevronRight,
    SfIconMenu,
    SfCounter,
    SfIconArrowBack,
    useDisclosure,
    useTrapFocus,
    useDropdown,
    SfInput,
    SfIconSearch,
  } from '@storefront-ui/vue';
  import { ref, computed } from 'vue';
  import { unrefElement } from '@vueuse/core';
  import { Taxon, TaxonSchema } from '~/types/Taxon';


  const authStore = useAuthStore();
  const cartStore = useCartStore(); 
  const route = useRoute();
  const router = useRouter();
  const currentUrl = computed(()=>encodeURIComponent(route.fullPath));
  const loginUrl = ref(`/login?redirect=${currentUrl.value}`);
  const isCartOpen = ref(false)
  const pageCategoryBaseUrl = '/categorie/';

  // Mettre à jour `loginUrl` chaque fois que la route change
  watch(() => route.fullPath, (newPath) => {
    if (newPath === "/" || newPath.split('?')[0] === '/login')
    {
      loginUrl.value='/login?redirect=%2f';//redirige sur la home
    }
    else{
      loginUrl.value = `/login?redirect=${encodeURIComponent(newPath.split('?')[0])}`;
    }    
  });

  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const logout = () => {
    authStore.logout();
    cartStore.ressetCart();
    //navigateTo('/')
  }

  const findNode = (keys: string[], node: Taxon): Taxon => {
    if (keys.length > 1) {
      const [currentKey, ...restKeys] = keys;
      return findNode(restKeys, node.children?.find((child) => child.code === currentKey) || node);
    } else {
      return node.children?.find((child) => child.code === keys[0]) || node;
    }
  };

  const { close, open, isOpen } = useDisclosure();
  const { referenceRef, floatingRef, style } = useDropdown({
    isOpen,
    onClose: close,
    placement: 'bottom-start',
    middleware: [],
  });

  const drawerRef = ref();
  const megaMenuRef = ref();
  const triggerRefs = ref();
  const activeNode = ref<string[]>([]);

  const activeMenu = computed(() => findNode(activeNode.value, content));
  const bannerNode = computed(() => findNode(activeNode.value.slice(0, 1), content));

  const trapFocusOptions = {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
  } as const;
  useTrapFocus(
    computed(() => megaMenuRef.value?.[0]),
    trapFocusOptions,
  );
  useTrapFocus(drawerRef, trapFocusOptions);

  const openMenu = (menuType: string[]) => {
    activeNode.value = menuType;
    open();
  };

  const goBack = () => {
    activeNode.value = activeNode.value.slice(0, activeNode.value.length - 1);
  };

  const goNext = (key: string) => {
    activeNode.value = [...activeNode.value, key];
  };

  const focusTrigger = (index: number) => {
    unrefElement(triggerRefs.value[index]).focus();
  };

  const inputValue = ref('');

  const search = () => {
    alert(`Successfully found 10 results for ${inputValue.value}`);
  };

  const actionItems = computed(()=>[
    {
      icon: SfIconShoppingCart,
      label: '',
      ariaLabel: 'Cart',
      role: 'button',
      onClick: ()=>isCartOpen.value = true,
      numberItems: Array.isArray(cartStore.items) ? cartStore.items.reduce((acc, item) => acc + item.quantity, 0) : 0
    },
    {
      icon: SfIconFavorite,
      label: '',
      ariaLabel: 'Wishlist',
      role: 'button',
    },
    {
      icon: SfIconPerson,
      label: isAuthenticated.value ? '' : 'Login',
      ariaLabel: isAuthenticated.value ? 'my account' : 'Login',
      role: isAuthenticated.value ? 'button' : 'login',
      onClick: ()=>router.push(loginUrl.value)
    },
  ]);

  type Node = {
    key: string;
    value: {
      label: string;
      link?: string;
      banner?: string;
      bannerTitle?: string;
    };
    children?: Node[];
    isLeaf: boolean;
  };

  const content: Taxon = TaxonSchema.safeParse({code: 'root'}).data

  const {data: menu} = await useFetch('/api/categorie');

  if(menu?.value?.success){
    content.children = menu.value.items??[];
  }

  //console.log(content)
</script>