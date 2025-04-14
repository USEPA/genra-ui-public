import {
  createPinia,
} from 'pinia'
import {useSettingsStore} from '~/stores/settings.ts'

import {defineNuxtPlugin, Context} from '#app'

const pinia = createPinia()
const settingsStore = useSettingsStore(pinia)
const {settings} = settingsStore

export default defineNuxtPlugin((nuxtApp: Context) => {
  nuxtApp.provide('endpointSettings', settings)
  // now available on `nuxtApp.$endpointSettings`
})
