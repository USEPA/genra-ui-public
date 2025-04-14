// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import initialState from './state'

export default {
  setAssayRows(state, assayRows) {
    Vue.set(state, 'assayGridRows', assayRows)
  },
  setAssayColumns(state, assayColumns) {
    Vue.set(state, 'assayGridColumns', assayColumns)
  },
  setAssayDataLoading(state, updatedLoadingState) {
    state.assayDataPanelLoading = updatedLoadingState
  },
  setAssayDataPanelError(state, updatedDataPanelError) {
    state.assayDataPanelError = updatedDataPanelError
  },
  setShowPagination(state) {
    state.showPagination = !state.showPagination
  },
  resetState(state) {
    Object.assign(state, initialState())
  },
  setGroup(state, updatedGroup) {
    Vue.set(state, 'group', [...updatedGroup])
  },
  setBy(state, updatedBy) {
    Vue.set(state, 'by', [...updatedBy])
  },
  setAssayInputOptions(state, updatedInputOptions) {
    Vue.set(state, 'assayInputOptions', [...updatedInputOptions])
  },
}
