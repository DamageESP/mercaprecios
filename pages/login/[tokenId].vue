<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

const { params } = useRoute();
const token = params.tokenId;

onMounted(() => {
  $fetch(`/api/login/${token}`, {
    method: "POST",
  });
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
