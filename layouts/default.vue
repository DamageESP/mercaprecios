<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

function doLogout() {
  supabase.auth.signOut();
  router.replace("/");
}
</script>

<template>
  <header class="max-w-screen-xl mx-auto">
    <nav class="bg-white border-gray-200">
      <div class="flex flex-wrap items-center justify-between p-4">
        <router-link
          to="/"
          class="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/logo.svg" class="h-5 md:h-8" alt="Mercaprecios Logo" />
          <span
            class="self-center text-2xl hidden md:block font-semibold whitespace-nowrap indie-flower-bold"
            >Mercaprecios</span
          >
        </router-link>
        <div class="flex gap-6 justify-end md:text-lg">
          <div class="flex items-center">
            <i class="icon-user me-2"></i>
            <router-link :to="user ? '/dashboard' : '/login'">
              <span class="indie-flower-bold">Tus precios</span>
            </router-link>
            <button
              @click="doLogout"
              class="ms-2 px-1 rounded bg-blue-200 border border-blue-300 text-sm hover:bg-blue-100 active:bg-blue-400"
              v-if="user"
              type="button"
            >
              Salir
            </button>
          </div>
          <a
            href="https://github.com/DamageESP/mercaprecios"
            target="_blank"
            class="indie-flower-bold flex items-center"
          >
            <i class="icon-github me-2"></i>
            <span>Github</span>
          </a>
        </div>
      </div>
    </nav>
  </header>
  <NuxtPage />
</template>
