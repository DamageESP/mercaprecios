// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  plugins: [{ src: "~/plugins/chartjs.ts" }],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  // Add a main.scss file in the assets directory
  css: ["~/assets/main.scss", "~/assets/icons.scss"],

  // Inject env variables to the client
  runtimeConfig: {
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseAnonKey: process.env.NUXT_SUPABASE_KEY,
  },

  ssr: false,

  // Add link styles to head of the app
  app: {
    head: {
      title:
        "Mercaprecios - Rastrea Precios de Supermercados y Gestiona tus Gastos Fácilmente",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Indie+Flower&display=swap",
        },
      ],
    },
  },

  supabase: {
    // Do not redirect the user to /login if not authenticated
    // (allow the user to navigate freely, auth will be checked on the specific pages)
    redirect: false
  }
});