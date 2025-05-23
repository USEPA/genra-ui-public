// plugins/vue-js-modal.js
// import Vue from 'vue'
import VModal from 'vue-js-modal/dist/ssr.nocss'
import 'vue-js-modal/dist/styles.css'
import {defineNuxtPlugin, Context} from '#app'

export default defineNuxtPlugin((nuxtApp: Context) => {
  nuxtApp.vueApp.use(VModal)
})
