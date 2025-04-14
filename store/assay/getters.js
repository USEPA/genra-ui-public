export default {
  getAssayChemicals(state) {
    return state.assayChemicals
  },
  getAssayGridRows(state) {
    return state.assayGridRows
  },
  getAssayGridCols(state) {
    return state.assayGridColumns
  },
  getAssayDataLoading(state) {
    return state.assayDataPanelLoading
  },
  getAssayDataPanelError(state) {
    return state.assayDataPanelError
  },
  getShowPagination(state) {
    return state.showPagination
  },
  getGroup(state) {
    return state.group
  },
  getBy(state) {
    return state.by
  },
  getAssayInputOptions(state) {
    return state.assayInputOptions
  },
}
