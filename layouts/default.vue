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
        <router-link to="/login">
          <div class="flex gap-6 justify-end md:text-lg">
            <div class="indie-flower-bold flex items-center">
              <i class="icon-user me-2"></i>
              <span>Tus precios</span>
            </div>
            <div class="indie-flower-bold flex items-center">
              <i class="icon-github me-2"></i>
              <span>Github</span>
            </div>
          </div>
        </router-link>
      </div>
    </nav>
  </header>
  <NuxtPage />
</template>
