<script setup lang="ts">
import type { Product } from "@prisma/client";
import { debounce } from "chart.js/helpers";
import type { Serialize } from "~/email/types";

const searchTerm = defineModel<string>("searchTerm", { default: "" });
const isSearching = defineModel<boolean>("isSearching");
const searchResults = defineModel<Serialize<Product>[]>("searchResults", {
  default: [],
});
interface Props {
  shouldShowResults?: boolean;
}
withDefaults(defineProps<Props>(), {
  shouldShowResults: true,
});

const emit = defineEmits<{
  (e: "product-selected", product: Serialize<Product>): void;
}>();

const searchProducts = async () => {
  isSearching.value = true;
  const data = await $fetch("/api/products/search", {
    query: { q: searchTerm.value },
  });
  if (!data) return;
  searchResults.value = data;
  isSearching.value = false;
};

const debouncedSearchProducts = debounce(searchProducts, 500);

watch(searchTerm, () => {
  debouncedSearchProducts();
});

onMounted(() => {
  searchProducts();
});
</script>

<template>
  <div class="flex flex-col">
    <input type="search" v-model="searchTerm" placeholder="Buscar..."
      class="p-2 outline-none border border-slate-400 placeholder-slate-600 rounded" />
    <ul v-if="shouldShowResults && searchResults.length">
      <li v-for="product in searchResults" :key="product.uuid" @click="emit('product-selected', product)">
        {{ product.name }}
      </li>
    </ul>
  </div>
</template>
