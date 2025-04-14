/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import {defineNuxtConfig} from '@nuxt/bridge'

const development = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  bridge: {
    typescript: true,
    capi: true,
    meta: true,
    nitro: false, // If migration to Nitro is complete, set to true
  },
  messages: {
    loading: 'Loading...',
    error_404: 'This page could not be found',
    server_error: 'Server error',
    nuxtjs: 'Nuxt.js',
    back_to_home: 'Back to the home page',
    server_error_details:
      'An error occurred in the application and your page could not be served. If you are the application owner, check your logs for details.',
    client_error: 'Error',
    client_error_details:
      'An error occurred while rendering the page. Check developer tools console for details.',
  },
  server: {
    port: 3000,
    host: 'localhost',
    timing: true,
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  app: {
    head: {
      title: 'GenRA',
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          'http-equiv': 'cache-control',
          content: 'no-cache',
        },
        {
          'http-equiv': 'expires',
          content: '0',
        },
        {
          'http-equiv': 'pragma',
          content: 'no-cache',
        },
        {
          name: 'description',
          content: 'EPA CCTE general read across application',
        },
      ],
      script: [
        {
          src: '/genra/ga.js',
        },
        {
          src: '/genra/js/force-graph.js',
        },
        {
          src: '/genra/js/d3-quadtree.js',
        },
        {
          src: '/genra/js/d3-force.js',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/genra/favicon.ico',
        },
      ],
    },
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~node_modules/animate.css/animate.css',
    '~node_modules/ag-grid-community/styles/ag-grid.css',
    '~node_modules/ag-grid-community/styles/ag-theme-balham.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // '~plugins/axios',
    '~plugins/settings',
    '~plugins/utility',
    '~plugins/export',
    '~plugins/modal.ts',
    '~plugins/repository',
    '~/plugins/font-awesome.ts',
    '~plugins/ag-grid.ts',
    '~plugins/cypress.client.ts',
  ],
  serverMiddleware: ['~/middleware/headers'],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'nuxt-vue-select',
    [
      '@pinia/nuxt',
      {
        disableVuex: false,
        autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
      },
    ],
  ],

  // Bootstrap-vue module configuration
  bootstrapVue: {
    icons: true,
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.APPLICATION_GENRA_API_BASE,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: 'true',
        cacheGroups: {},
      },
    },
    transpile: ['vuex', 'ag-grid-vue'],
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
    },
  },
  router: {
    base: process.env.APPLICATION_ROUTER_BASE,
  },
})
