<script setup lang="ts">
import { Chart } from "vue-chartjs";

const route = useRoute();
const product = await $fetch(`/api/products/${route.params.id}`);
</script>

<template>
  <div class="max-w-screen-xl mx-auto">
    <h1 class="text-2xl mb-4 indie-flower-bold">Información del producto</h1>
    <product-component v-if="product" :product="product" class="mb-6" />
    <h1 class="text-2xl mb-4 indie-flower-bold">Evolución del precio</h1>
    <ClientOnly>
      <Chart type="line" :data="product.timeSeries" />
    </ClientOnly>
  </div>
</template>
