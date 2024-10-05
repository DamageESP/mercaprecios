<script setup lang="ts">
const email = ref("");
const isLoading = ref(false);

async function doLogin() {
  isLoading.value = true;
  await $fetch("/api/login/link", {
    method: "POST",
    body: JSON.stringify({ email: email.value }),
  });
  isLoading.value = false;
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto mt-[100px] flex items-center justify-center">
    <div class="w-[400px] flex flex-col text-center">
      <div class="flex items-center justify-center mb-4">
        <i class="icon-mail me-5" />
        <span class="indie-flower-bold text-4xl" placeholder="pepeflores@">Tu email</span>
      </div>
      <p>Te enviaremos un enlace para iniciar sesión.</p>
      <input type="email" v-model="email" class="py-3 px-5 border rounded my-4" />
      <button @click="doLogin" type="button"
        class="flex items-center p-3 border border-slate-400 rounded-lg text-center justify-center hover:bg-slate-200">
        <i class="icon-paperplane me-2" />
        <span>Enviar enlace</span>
      </button>
    </div>
  </div>
</template>
