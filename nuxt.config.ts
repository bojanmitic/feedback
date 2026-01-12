// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/i18n"],
  i18n: {
    restructureDir: false,
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "fi",
        name: "Finnish",
        file: "fi.json",
      },
    ],
    lazy: true,
    langDir: "locales",
    defaultLocale: "en",
    strategy: "prefix_except_default",
  },
});
