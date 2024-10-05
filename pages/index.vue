<script setup lang="ts">
import { ref } from "vue";
import type { ProductWithPurchase, Serialize } from "~/email/types";

const search = ref("");
const isSearching = ref(false);
const searchResults = ref<Serialize<ProductWithPurchase>[]>([]);

const { data: recentlyChangedProducts, status } = await useLazyFetch(
  "/api/products"
);
</script>

<template>
  <article class="max-w-screen-xl mx-auto my-4 lg:my-14 px-4">
    <div class="flex items-center mb-2 md:mb-6">
      <i class="icon-rocket !min-w-6 !max-w-6 md:!max-w-12 md:!mx-h-12 me-4" />
      <h1 class="md:text-2xl lg:text-4xl font-bold">
        ¡Rastrea tus productos favoritos!
      </h1>
    </div>
    <p class="md:text-xl">
      Simplemente reenvía tus correos con tickets a
      <strong class="font-semibold">mercaprecios.tickets@gmail.com</strong>
      y accede a tu panel personal donde podrás controlar tus gastos y detectar
      cambios en los precios.
    </p>
  </article>
  <div class="max-w-screen-xl mx-auto px-4">
    <h1 class="text-2xl mb-4 indie-flower-bold">Cambios en la última semana</h1>
    <div class="flex gap-2 mb-4 overflow-x-auto">
      <nuxt-link
        v-for="product in recentlyChangedProducts"
        :key="product.uuid"
        :to="`/${product.uuid}`"
      >
        <product-component class="w-[250px] h-full" :product="product" />
      </nuxt-link>
    </div>
    <h1 class="text-2xl mb-4 indie-flower-bold">Los productos más populares</h1>
    <product-search-component
      class="mb-4"
      v-model:search-term="search"
      v-model:isSearching="isSearching"
      v-model:search-results="searchResults"
      :should-show-results="false"
    />
    <section v-if="isSearching" class="flex items-center justify-center">
      <i class="icon-spinner me-3" />
      <p class="text-xl indie-flower-bold">Buscando...</p>
    </section>
    <section v-else-if="!searchResults.length" class="text-center">
      <p class="text-xl indie-flower-bold">No hay resultados</p>
    </section>
    <section
      v-else
      class="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2"
    >
      <nuxt-link
        v-for="product in searchResults"
        :key="product.uuid"
        :to="`/${product.uuid}`"
      >
        <product-component class="h-full" :product="product" />
      </nuxt-link>
    </section>
  </div>
</template>
