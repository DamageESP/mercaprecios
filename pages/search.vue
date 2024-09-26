<script setup lang="ts">
import { debounce } from 'chart.js/helpers';
import { ref } from 'vue'
import { Chart } from 'vue-chartjs';
import { useRouter } from 'vue-router'
import type { TimeSeriesData } from '~/email/types';

const router = useRouter()
const search = ref(router.currentRoute.value.query.q || '')
const chartData = ref<TimeSeriesData>()

const fetchProducts = debounce(async () => {
  const { data } = await useFetch('/api/products', {
    query: { q: search.value }
  })
  if (!data.value) return
  chartData.value = data.value
}, 500)

const searchHandler = () => {
  router.replace({ path: '/search', query: { q: search.value } })
}

watch(() => router.currentRoute.value.query.q, () => {
  fetchProducts()
}, { immediate: true })
</script>

<template>
  <div class="search">
    <input type="text" v-model="search" @input="searchHandler" placeholder="Search..." />
  </div>
  <div>
    <ClientOnly>
      <Chart v-if="chartData" type="line" :data="chartData" />
    </ClientOnly>
  </div>
</template>