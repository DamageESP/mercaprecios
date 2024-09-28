// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  plugins: [{ src: "~/plugins/chartjs.ts" }],
  modules: ["@nuxtjs/tailwindcss"],

  // Add a main.scss file in the assets directory
  css: ["~/assets/main.scss", "~/assets/icons.scss"],

  // Add link styles to head of the app
  app: {
    head: {
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
});
