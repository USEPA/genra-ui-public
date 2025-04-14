export default {
  getReadAcrossChemicals(state) {
    return state.readAcrossChemicals
  },
  getReadAcrossRows(state) {
    return state.readAcrossGrid
  },
  getRunReadAcrossRows(state) {
    return state.runReadAcrossGrid
  },
  getGraReadAcrossCols(state) {
    return state.graReadAcrossColumns
  },
  getRraReadAcrossCols(state) {
    return state.rraReadAcrossColumns
  },
  getCurrentReadAcrossCols(state, getters, rootState) {
    return rootState.step > 3 ? state.rraReadAcrossColumns : state.graReadAcrossColumns
  },
  getGraLatestSortOption(state) {
    return state.graLatestSortOption
  },
  getReadAcrossLoading(state) {
    return state.readAcrossLoading
  },
  getReadAcrossError(state) {
    return state.readAcrossError
  },
  getGenra(state) {
    return state.genra
  },
  getMin(state) {
    return state.min
  },
  getDownloadValue(state) {
    return state.downloadValue
  },
  getFilter(state) {
    return state.filter
  },
  getSimilarityWidth(state) {
    return state.similarityWidth
  },
  getRunReadAcrossLoading(state) {
    return state.runReadAcrossLoading
  },
  getRunReadAcrossError(state) {
    return state.runReadAcrossError
  },
  getReadAcrossStepError(state) {
    return state.readAcrossStepError
  },
  getShowPagination(state) {
    return state.showPagination
  },
  getReadAcrossFilterApplied(state) {
    return state.readAcrossFilterApplied
  },
  getReadAcrossFilteredAssays(state) {
    return state.readAcrossFilteredAssays
  },
  getDisableDownload(state) {
    return state.disableDownload
  },
  getPredEngines(state) {
    return state.predEngines
  },
  getGraSortOptions(state) {
    return state.graSortOptions
  },
  getRraSortOptions(state) {
    return state.rraSortOptions
  },
}
