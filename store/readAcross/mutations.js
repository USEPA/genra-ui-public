// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import initialState from './state'

export default {
  setReadAcrossChemicals(state, updatedReadAcrossChemicals) {
    Vue.set(state, 'readAcrossChemicals', [...updatedReadAcrossChemicals])
  },
  setReadAcrossGrid(state, readAcrossGrid) {
    Vue.set(state, 'readAcrossGrid', [...readAcrossGrid])
  },
  setRunReadAcrossGrid(state, readAcrossGrid) {
    Vue.set(state, 'runReadAcrossGrid', [...readAcrossGrid])
  },
  setGraReadAcrossColumns(state, readAcrossColumns) {
    Vue.set(state, 'graReadAcrossColumns', [...readAcrossColumns])
  },
  setRraReadAcrossColumns(state, readAcrossColumns) {
    Vue.set(state, 'rraReadAcrossColumns', [...readAcrossColumns])
  },
  setGraLatestSortOption(state, updatedSortOption) {
    state.graLatestSortOption = updatedSortOption
  },
  setReadAcrossLoading(state, updatedLoading) {
    state.readAcrossLoading = updatedLoading
  },
  setReadAcrossError(state, updatedError) {
    state.readAcrossError = updatedError
  },
  resetState(state) {
    Object.assign(state, initialState())
  },
  setDownloadValue(state, updatedDownloadValue) {
    state.downloadValue = updatedDownloadValue
  },
  setFilter(state, updatedFilter) {
    state.filter = updatedFilter
  },
  setSimilarityWidth(state, updatedSimilarityWidth) {
    state.similarityWidth = updatedSimilarityWidth
  },
  setRunReadAcrossLoading(state, updatedLoading) {
    state.runReadAcrossLoading = updatedLoading
  },
  setRunReadAcrossError(state, updatedError) {
    state.runReadAcrossError = updatedError
  },
  setReadAcrossStepError(state, updatedError) {
    state.readAcrossStepError = updatedError
  },
  setShowPagination(state) {
    state.showPagination = !state.showPagination
  },
  setReadAcrossFilterApplied(state, updatedReadAcrossFilterApplied) {
    state.readAcrossFilterApplied = updatedReadAcrossFilterApplied
  },
  setReadAcrossFilteredAssays(state, updatedReadAcrossFilteredAssays) {
    state.readAcrossFilteredAssays = [...updatedReadAcrossFilteredAssays]
  },
  setDisableDownload(state, updatedDisableDownload) {
    state.disableDownload = updatedDisableDownload
  },
  setPredEngines(state, updatedPredEngines) {
    Vue.set(state, 'predEngines', [...updatedPredEngines])
  },
  setGraSortOptions(state, updatedSortOptions) {
    Vue.set(state, 'graSortOptions', [...updatedSortOptions])
  },
  setRraSortOptions(state, updatedSortOptions) {
    Vue.set(state, 'rraSortOptions', [...updatedSortOptions])
  },
}
