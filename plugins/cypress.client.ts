// plugins/cypress.js
import {
  defineNuxtPlugin, useNuxtApp, Context,
} from '#app'

const isCypress = typeof window.Cypress !== 'undefined'
let store = null

export default defineNuxtPlugin((nuxtApp: Context) => {
  const {nuxt2Context} = useNuxtApp()
  store = nuxt2Context.store
  if (isCypress) {
    window.store = store
  }
})
