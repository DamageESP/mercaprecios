<script setup lang="ts">
import type { Prisma, Product } from '@prisma/client';
import { ref } from 'vue'
import { Chart } from 'vue-chartjs';
import { useRouter } from 'vue-router'
import type { Serialize } from '~/email/types';

const router = useRouter()
const search = ref(router.currentRoute.value.query.q || '')
const products = ref<Serialize<Prisma.ProductGetPayload<{ include: { Purchase: { include: { ShoppingCart: true } } } }>>[]>()

const fetchProducts = async () => {
  const { data } = await useFetch('/api/products', {
    query: { q: search.value }
  })
  if (!data.value) return
  products.value = data.value
}

const searchHandler = () => {
  router.replace({ path: '/search', query: { q: search.value } })
}

watch(() => router.currentRoute.value.query.q, () => {
  fetchProducts()
})

const purchaseDates = computed(() => {
  return products.value?.map((product) => product.Purchase.map((purchase) => new Date(purchase.ShoppingCart.date))) || []
})

const earliestDataPoint = computed(() => purchaseDates.value.reduce((acc, val) => acc.concat(val), []).sort((a, b) => a.getTime() - b.getTime()).shift())

const latestDataPoint = computed(() => purchaseDates.value.reduce((acc, val) => acc.concat(val), []).sort((a, b) => b.getTime() - a.getTime()).pop())

const chartData = computed(() => ({
  labels: [earliestDataPoint.value, latestDataPoint.value],
  datasets: [
    {
      label: 'Price',
      backgroundColor: '#f87979',
      data: products.value?.map((product) => product.Purchase.map(p => p.price)) || []
    }
  ]
}))
</script>

<template>
  <div class="search">
    <input type="text" v-model="search" @input="searchHandler" placeholder="Search..." />
  </div>
  <div>
    <ClientOnly>
      <Chart type="line" :data="chartData" />
    </ClientOnly>
  </div>
</template>