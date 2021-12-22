export default {
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "EasyStock",
    title: "main",
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    meta: [{ charset: "utf-8" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/vee-validate.js", "~/plugins/axios.js"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
    "@nuxtjs/proxy",
    "nuxt-socket-io",
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {},
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Add exception
    transpile: ["vee-validate/dist/rules"],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // ...
    },
  },

  axios: {
    proxy: true,
  },

  proxy: {
    "/auth": { target: "http://localhost:8000", changeOrigin: true },
    "/clubs": { target: "http://localhost:8000", changeOrigin: true },
    "/users": { target: "http://localhost:8000", changeOrigin: true },
  },

  io: {
    sockets: [
      // Required
      {
        // At least one entry is required
        name: "home",
        url: "ws://localhost:80",
        default: true,
        vuex: {
          /* see section below */
        },
        namespaces: {},
      },
      //{ name: "work", url: "http://somedomain1:3000" },
      //{ name: "car", url: "http://somedomain2:3000" },
      //{ name: "tv", url: "http://somedomain3:3000" },
      //{ name: "test", url: "http://localhost:4000" },
    ],
  },
  server: {
    port: 3000,
  },

  serverMiddleware: ["~/server-middleware/cors.js"],

  router: {
    middleware: ["loadUser"],
  },
};
