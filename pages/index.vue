<script setup lang="ts">
import type { Product } from '@prisma/client';
import { debounce } from 'chart.js/helpers';
import { ref } from 'vue'
import { Chart } from 'vue-chartjs';
import { useRouter } from 'vue-router'
import type { Serialize, TimeSeriesData } from '~/email/types';

const router = useRouter()
const search = ref(router.currentRoute.value.query.q || '')
const chartData = ref<TimeSeriesData>()
const isLoading = ref(false)
const selectedProduct = ref<Serialize<Product | null>>(null)
const productResults = ref<Serialize<Product>[]>([])

const searchProducts = debounce(async () => {
  isLoading.value = true
  const data = await $fetch('/api/products', {
    query: { q: search.value }
  })
  if (!data) return
  productResults.value = data
  isLoading.value = false
}, 500)

const fetchProductData = debounce(async () => {
  if (!selectedProduct.value) return
  isLoading.value = true
  const data = await $fetch(`/api/products/${selectedProduct.value?.uuid}`)
  if (!data) return
  chartData.value = data
  isLoading.value = false
}, 500)

const searchHandler = () => {
  router.replace({ path: '/', query: { q: search.value } })
}

watch(() => router.currentRoute.value.query.q, () => {
  searchProducts()
}, { immediate: true })

watch(() => selectedProduct.value, () => {
  fetchProductData()
}, { immediate: true })
</script>

<template>
  <div class="search">
    <input type="text" v-model="search" @input="searchHandler" placeholder="Search..." />
  </div>
  <ul v-if="productResults.length">
    <li v-for="product in productResults" :key="product.uuid" @click="selectedProduct = product">
      {{ product.name }}
    </li>
  </ul>
  <div>
    <span v-if="isLoading">Cargando...</span>
    <ClientOnly v-else-if="chartData">
      <Chart type="line" :data="chartData" />
    </ClientOnly>
  </div>
</template>