<template>
    <div class="relative flex flex-col w-full max-h-[600px] aspect-[4/3]">
        <SfScrollable
        class="w-full h-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        :active-index="activeIndex"
        wrapper-class="h-full min-h-0"
        buttons-placement="none"
        :drag="{ containerWidth: true }"
        is-active-index-centered
        @on-drag-end="onDragged"
        >
        <div
            v-for="({ path }, index) in images"
            :key="`${index}`"
            class="flex justify-center h-full basis-full shrink-0 grow snap-center snap-always"
        >
            <img  :aria-hidden="activeIndex !== index" class="w-auto h-full" :src="path" />
        </div>
        </SfScrollable>
        <SfScrollable
        class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        :active-index="activeIndex"
        buttons-placement="floating"
        >
        <template #previousButton="defaultProps">
            <SfButton
            v-bind="defaultProps"
            class="absolute disabled:hidden !rounded-full z-10 left-4 bg-white"
            variant="secondary"
            size="sm"
            square
            >
            <SfIconChevronLeft size="sm" />
            </SfButton>
        </template>
        <button
            v-for="({ path }, index) in images"
            :key="`${index}-thumbnail`"
            type="button"
            
            :aria-current="activeIndex === index"
            :class="[
            'h-auto relative shrink-0 pb-1 my-4 -mr-2 border-b-4 snap-start cursor-pointer focus-visible:outline focus-visible:outline-offset transition-colors flex-grow md:flex-grow-0',
            activeIndex === index ? 'border-primary-700' : 'border-transparent',
            images.length > 5 ? 'w-1/5':`w-1/${images.length}`,
            ]"
            @click="activeIndex = index"
            @mouseover="activeIndex = index"
        >
            <img class="mx-auto object-contain border border-neutral-200" width="150" height="150" :src="path" />
        </button>
        <template #nextButton="defaultProps">
            <SfButton
            v-bind="defaultProps"
            class="absolute disabled:hidden !rounded-full z-10 right-4 bg-white"
            variant="secondary"
            size="sm"
            square
            >
            <SfIconChevronRight size="sm" />
            </SfButton>
        </template>
        </SfScrollable>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import {
    SfScrollable,
    SfButton,
    SfIconChevronLeft,
    SfIconChevronRight,
    type SfScrollableOnDragEndData,
  } from '@storefront-ui/vue';
  import { unrefElement, useIntersectionObserver } from '@vueuse/core';
  import { watch, type ComponentPublicInstance } from 'vue';
  
  const props = defineProps<{
    images: {
    "@id": string|null,
    "@type": string|null,
    "id": number|null,
    "type": string|null,
    "path": string
  }[];
  }>();
  const thumbsRef = ref<HTMLElement>();
  const firstThumbRef = ref<HTMLButtonElement>();
  const lastThumbRef = ref<HTMLButtonElement>();
  const firstThumbVisible = ref(false);
  const lastThumbVisible = ref(false);
  const activeIndex = ref(0);
  
  watch(
    thumbsRef,
    (thumbsRef) => {
      if (thumbsRef) {
        useIntersectionObserver(
          firstThumbRef,
          ([{ isIntersecting }]) => {
            firstThumbVisible.value = isIntersecting;
          },
          {
            root: unrefElement(thumbsRef),
            rootMargin: '0px',
            threshold: 1,
          },
        );
      }
    },
    { immediate: true },
  );
  
  watch(
    thumbsRef,
    (thumbsRef) => {
      if (thumbsRef) {
        useIntersectionObserver(
          lastThumbRef,
          ([{ isIntersecting }]) => {
            lastThumbVisible.value = isIntersecting;
          },
          {
            root: unrefElement(thumbsRef),
            rootMargin: '0px',
            threshold: 1,
          },
        );
      }
    },
    { immediate: true },
  );
  
  const onDragged = (event: SfScrollableOnDragEndData) => {
    if (event.swipeRight && activeIndex.value > 0) {
      activeIndex.value -= 1;
    } else if (event.swipeLeft && activeIndex.value < images.length - 1) {
      activeIndex.value += 1;
    }
  };
  
  const assignRef = (el: Element | ComponentPublicInstance | null, index: number) => {
    if (!el) return;
    if (index === props.images.length - 1) {
      lastThumbRef.value = el as HTMLButtonElement;
    } else if (index === 0) {
      firstThumbRef.value = el as HTMLButtonElement;
    }
  };
  </script>