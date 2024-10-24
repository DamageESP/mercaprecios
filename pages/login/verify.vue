<script setup lang="ts">
const user = useSupabaseUser();

definePageMeta({
  layout: "empty",
});

const { query } = useRoute();
const token = query.tokenId;

onMounted(() => {
  console.log(user.value);
});
</script>

<template>
  <div
    class="w-full min-w-full max-w-full h-screen flex flex-col items-center justify-center"
  >
    <i class="icon-smile mb-5" />
    <span class="indie-flower-bold text-4xl">Iniciando sesión...</span>
  </div>
</template>
