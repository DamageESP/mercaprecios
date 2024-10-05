<script setup lang="ts">
const user = useSupabaseUser();
const router = useRouter();

const { data } = await useLazyFetch("/api/dashboard");
console.log(data.value);

onMounted(() => {
  if (!user.value) {
    router.replace("/");
  }
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto my-4 lg:my-14 px-4">
    Hello {{ user?.email }}
  </div>
</template>
