<script setup lang="ts">
import type { ProductWithPurchase, Serialize } from "~/email/types";

const props = defineProps<{
  product: Serialize<ProductWithPurchase>;
}>();

const product = toRef(props, "product");

import { computed } from "vue";

const productFirstPurchase = computed(() => {
  return product.value.Purchase?.sort((p1, p2) => {
    return (
      new Date(p1.ShoppingCart.date).getTime() -
      new Date(p2.ShoppingCart.date).getTime()
    );
  })?.[0];
});

const productLatestPurchase = computed(() => {
  return product.value.Purchase?.sort((p1, p2) => {
    return (
      new Date(p2.ShoppingCart.date).getTime() -
      new Date(p1.ShoppingCart.date).getTime()
    );
  })?.[0];
});

// Format date in format DD/MM/YYYY
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-ES");
};

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const didProductGetCheaper = computed(() => {
  return productFirstPurchase.value?.price > productLatestPurchase.value?.price;
});

const didProductGetMoreExpensive = computed(() => {
  return productFirstPurchase.value?.price < productLatestPurchase.value?.price;
});

const priceDifference = computed(() => {
  return Math.abs(
    productLatestPurchase.value?.price - productFirstPurchase.value?.price
  );
});

const percentageDifference = computed(() => {
  return Math.round(
    (priceDifference.value / productFirstPurchase.value?.price) * 100
  );
});
</script>

<template>
  <article
    class="p-4 flex flex-col rounded-lg hover:border-gray-600 border-2 border-transparent"
    :class="{
      'bg-gray-100': !didProductGetCheaper && !didProductGetMoreExpensive,
      'bg-green-200': didProductGetCheaper,
      'bg-red-200': didProductGetMoreExpensive,
    }"
  >
    <header class="flex items-center mb-2">
      <i class="icon-product me-2"></i>
      <h2
        class="text-lg whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold"
      >
        {{ product.name }}
      </h2>
    </header>
    <div class="grid grid-cols-2 gap-3">
      <div class="flex items-center">
        <i class="icon-bill me-2"></i>
        <span>{{ product.Purchase?.length ?? 0 }} compras</span>
      </div>
      <div class="flex items-center">
        <i class="icon-calendar me-2"></i>
        <span>{{ formatDate(productLatestPurchase.ShoppingCart.date) }}</span>
      </div>
      <div class="flex items-center">
        <i class="icon-coin me-2"></i>
        <span>{{ formatMoney(productLatestPurchase.price) }}</span>
      </div>
      <div
        class="flex items-center"
        v-if="didProductGetCheaper || didProductGetMoreExpensive"
      >
        <i
          class="me-2"
          :class="{
            'icon-trend-down': didProductGetCheaper,
            'icon-trend-up': didProductGetMoreExpensive,
          }"
        ></i>
        <span v-if="didProductGetCheaper">-</span>
        <span v-else>+</span>
        <span
          >{{ formatMoney(priceDifference) }} ({{
            percentageDifference
          }}
          %)</span
        >
      </div>
      <span v-else></span>
    </div>
  </article>
</template>
