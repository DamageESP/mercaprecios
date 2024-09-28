<script setup lang="ts">
import { ref } from "vue";
import type { ProductWithPurchase, Serialize } from "~/email/types";

const route = useRoute();
const search = ref((route.query.q as string) || "");
const isSearching = ref(false);
const searchResults = ref<Serialize<ProductWithPurchase>[]>([]);
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4">
    <product-search-component class="mb-4" v-model:search-term="search" v-model:isSearching="isSearching"
      v-model:search-results="searchResults" :should-show-results="false" />
    <h1 class="text-2xl mb-4 indie-flower-bold">Resultados</h1>
    <section v-if="isSearching" class="text-center">
      <i class="icon-spinner me-3" />
      <p class="text-xl indie-flower-bold">Buscando...</p>
    </section>
    <section v-else-if="!searchResults.length" class="text-center">
      <p class="text-xl indie-flower-bold">No hay resultados</p>
    </section>
    <section v-else class="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2">
      <nuxt-link v-for="product in searchResults" :key="product.uuid" :to="`/${product.uuid}`">
        <product-component class="h-full" :product="product" />
      </nuxt-link>
    </section>
  </div>
</template>
