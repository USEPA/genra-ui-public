/* eslint-disable import/extensions */

import createRepository from '~/api/Repository'
import HelpTextsRepository from '~/api/HelpTextsRepository'
import ChemicalSearchRepository from '~/api/ChemicalSearchRepository'
import GenraRepository from '~/api/GenraRepository'
import {
  defineNuxtPlugin, useNuxtApp, Context,
} from '#app'

export default defineNuxtPlugin((nuxtApp: Context) => {
  const {
    nuxt2Context,
  } = useNuxtApp()
  const repositoryWithAxios = createRepository(nuxt2Context)
  const repositories = {
    chemicalSearch: new ChemicalSearchRepository(nuxt2Context).build(),
    helpTexts: new HelpTextsRepository(nuxt2Context).build(),
    genra: new GenraRepository(nuxt2Context).build(),
  }
  nuxtApp.provide('repositories', repositories)
  // now available on `nuxtApp.$repositories`
})
