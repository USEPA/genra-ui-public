// plugins/vue-js-modal.js
// import Vue from 'vue'
import axios from 'axios'
import 'vue-js-modal/dist/styles.css'
import {defineNuxtPlugin, Context} from '#app'

export default defineNuxtPlugin((nuxtApp: Context) => {
  nuxtApp.provide('newAxios', axios)
  // now available on `nuxtApp.$newAxios`
})
