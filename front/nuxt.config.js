export default {
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "SweetClub",
    title: "SweetClub",
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    meta: [
      { charset: "utf-8" },
      { name: "viewport" },
      { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      { name: "description", content: "동아리 전용 사이트" },
      { hid: "ogtitle", name: "og:title", content: "SweetClub" },
      {
        hid: "ogdescription",
        name: "og:description",
        content: "동아리 전용 사이트",
      },
      { hid: "ogtype", name: "og:type", content: "website" },
      { hid: "ogurl", name: "og:url", content: "http:" },
    ],
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
    "@nuxtjs/dotenv",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
    "@nuxtjs/proxy",
    "nuxt-socket-io",
    "@nuxtjs/dayjs",
    "@nuxtjs/markdownit",
  ],

  markdownit: {
    preset: "default",
    linkify: true,
    breaks: true,
    html: true,
    use: ["markdown-it-div", "markdown-it-attrs"],
    runtime: true,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {},
  },

  dayjs: {
    locales: ["ko"],
    defaultLocale: "ko",
    defaultTimeZone: "Asia/Korea",
    plugins: ["utc", "timezone", "relativeTime", "advancedFormat"],
  },

  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Add exception
    transpile: ["vee-validate/dist/rules"],
    /*
     ** You can extend webpack config here
     */
    analyze: false,
    extend(config, { isClient, isServer }) {
      if (isServer && config.mode === "production") {
        config.devtool = "hidden-source-map";
      }
      // console.log("webpack", config, isServer, isClient);
    },
  },

  axios: {
    browserBaseURL:
      process.env.NODE_ENV === "production"
        ? "http://ec2-3-36-57-228.ap-northeast-2.compute.amazonaws.com/api"
        : "http://localhost:8080/api",
    baseURL:
      process.env.NODE_ENV === "production"
        ? `http://${process.env.NGINX_AXIOS_URL}/api`
        : "http://nginx:80/api",
    https: false,
    credentials: true,
  },

  /*proxy: {
    "/auth": { target: "http://back:8000/api", changeOrigin: true },
    "/clubs": { target: "http://back:8000/api", changeOrigin: true },
    "/users": { target: "http://back:8000/api", changeOrigin: true },
  },*/

  io: {
    sockets: [
      // Required
      {
        // At least one entry is required
        name: "home",
        url: "http://localhost:8080",
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
    host: process.env.NUXT_HOST || "0.0.0.0",
    port: process.env.NUXT_PORT || 4000,
  },
  router: {
    middleware: ["loadUser"],
  },

  watchers: {
    webpack: {
      poll: true,
    },
  },
};
