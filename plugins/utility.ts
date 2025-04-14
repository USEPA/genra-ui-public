import {defineNuxtPlugin, useNuxtApp} from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const {nuxt2Context} = useNuxtApp()
  const isError = data => (data && data.stack && data.message && typeof data.stack === 'string' && typeof data.message === 'string') || data.error === 'Notfound' || (data && Object.keys(data).length === 0 && data.constructor === Object) || (data && data.constructor === Array && data.length === 0)
  const isRadialError = data => data.length < 2
  const isSetupError = data => data.length < 1
  const colormaps = {
    inferno: [
      '#000004', '#03010c', '#070313', '#0a041b', '#0e0522', '#11072a', '#150831', '#180939', '#1c0b40',
      '#1f0c48', '#250c4c', '#2b0d50', '#310d54', '#370d58', '#3d0e5d', '#430e61', '#490e65', '#4f0f69',
      '#550f6d', '#5b116d', '#60136c', '#66156c', '#6c176c', '#711a6b', '#771c6b', '#7d1e6b', '#82206a',
      '#88226a', '#8e2468', '#932665', '#992963', '#9e2b61', '#a42d5e', '#a92f5c', '#af325a', '#b43457',
      '#ba3655', '#bf3a51', '#c33e4d', '#c8424a', '#cc4646', '#d14942', '#d54d3e', '#da513b', '#de5537',
      '#e35933', '#e65f2e', '#e96629', '#eb6c24', '#ee731f', '#f17919', '#f47f14', '#f6860f', '#f98c0a',
      '#f9930e', '#f99a13', '#f9a017', '#f9a71c', '#f9ae20', '#f9b525', '#f9bb29', '#f9c22e', '#f9c932',
      '#f9cf3f', '#fad54b', '#fadb58', '#fae165', '#fbe771', '#fbed7e', '#fbf38b', '#fcf997', '#fcffa4',
    ],
  }
  const imageUrl = chemId => `${process.env.APPLICATION_GENRA_API_BASE}${nuxt2Context.app.store.state.settings.GENRA_IMAGE_DEV_ENDPOINT}${encodeURIComponent(chemId)}.svg`
  const translateSelectOptions = inputOptions => inputOptions.map(val => ({
    ...val, text: val.name, value: val.key, disabled: !val.data_exists,
  }))
  const getParamKey = (val) => {
    switch (val) {
    case 'neighbor_by':
      return 'fp'
    case 'filter_by':
      return 'sel_by'
    case 'group':
      return 'summarise'
    case 'by':
      return 'sumrs_by'
    default:
      return 'fp'
    }
  }
  const getFileNameFromHeaders = responseHeaders => responseHeaders['content-disposition'].split('=').pop().trim()
  const utilities = {
    isError: isError,
    colormaps: colormaps,
    imageUrl: imageUrl,
    isRadialError: isRadialError,
    isSetupError: isSetupError,
    translateSelectOptions: translateSelectOptions,
    getParamKey: getParamKey,
    getFileNameFromHeaders,
  }
  nuxtApp.provide('utility', utilities)
  // now available on `nuxtApp.$repositories`
})
