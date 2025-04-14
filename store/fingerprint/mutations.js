// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import initialState from './state'

export default {
  setHeatChemicalsArr(state, updatedHeatChemicals) {
    Vue.set(state, 'heatChemicalsArr', [...updatedHeatChemicals])
  },
  setHeatChemicalsColDefs(state, updatedHeatColDefs) {
    Vue.set(state, 'heatChemicalsColDefs', [...updatedHeatColDefs])
  },
  setFingerprintHeatPanelLoading(state, updatedPanelLoading) {
    state.fingerprintHeatPanelLoading = updatedPanelLoading
  },
  setFingerprintRefreshLoading(state, updatedRefreshLoading) {
    state.fingerprintRefreshLoading = updatedRefreshLoading
  },
  setFingerprintDataLoading(state, updatedDataLoading) {
    state.fingerprintDataLoading = updatedDataLoading
  },
  setFingerprintHeatPanelError(state, updatedPanelError) {
    state.fingerprintHeatPanelError = updatedPanelError
  },
  resetState(state) {
    Object.assign(state, initialState())
  },
}
