<template>
  <NuxtLayout>
    <header class="max-w-screen-xl mx-auto">
      <nav class="bg-white border-gray-200">
        <div class="flex flex-wrap items-center justify-between p-4">
          <router-link
            to="/"
            class="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/logo.svg" class="h-8" alt="Mercaprecios Logo" />
            <span
              class="self-center text-2xl font-semibold whitespace-nowrap indie-flower-bold"
              >Mercaprecios</span
            >
          </router-link>
        </div>
      </nav>
    </header>
    <NuxtPage />
  </NuxtLayout>
</template>
