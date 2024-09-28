<script setup lang="ts">
import { Chart } from "vue-chartjs";

const route = useRoute();
const { data: product, status: isLoading } = await useLazyFetch(`/api/products/${route.params.id}`);
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4">
    <span class="text-2xl indie-flower-bold" v-if="isLoading === 'pending'">Cargando...</span>
    <template v-else-if="product">
      <h1 class="text-2xl mb-4 indie-flower-bold">Información del producto</h1>
      <product-component v-if="product" :product="product" class="mb-6" />
      <h1 class="text-2xl mb-4 indie-flower-bold">Evolución del precio</h1>
      <ClientOnly>
        <Chart type="line" :data="product.timeSeries" />
      </ClientOnly>
    </template>
  </div>
</template>
