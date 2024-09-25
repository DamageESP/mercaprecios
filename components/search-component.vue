<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const search = ref('')
const searchHandler = () => {
    router.push({ path: '/search', query: { q: search.value } })
}

const searchInputHandler = (e: Event) => {
    search.value = (e.target as HTMLInputElement).value
}

const searchKeyupHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        searchHandler()
    }
}
</script>

<template>
    <div class="search">
        <input type="text" v-model="search" @input="searchInputHandler" @keyup="searchKeyupHandler"
            placeholder="Search..." />
        <button @click="searchHandler">Search</button>
    </div>
</template>