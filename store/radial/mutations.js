// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import initialState from './state'

export default {
  setRadialPanelLoading(state, updatedLoading) {
    state.radialPanelLoading = updatedLoading
  },
  setRadialPanelRefresh(state, updatedRefresh) {
    state.radialRefresh = updatedRefresh
  },
  setRadialPanelError(state, updatedError) {
    state.radialPanelError = updatedError
  },
  setChemicals(state, updatedChemicals) {
    Vue.set(state, 'chemicals', [...updatedChemicals])
  },
  setNeighborChemicals(state, updatedNeighborChemicals) {
    Vue.set(state, 'neighborChemicals', [...updatedNeighborChemicals])
  },
  setFingerprints(state, updatedFingerprints) {
    Vue.set(state, 'fingerprints', [...updatedFingerprints])
  },
  setValidFpArr(state, updatedFpArr) {
    Vue.set(state, 'validFpArr', [...updatedFpArr])
  },
  setFilterBy(state, updatedFilterBy) {
    Vue.set(state, 'filterBy', [...updatedFilterBy])
  },
  setLastWorkingRadialParams(state, updatedRadialParams) {
    state.lastWorkingRadialParams = {...updatedRadialParams}
  },
  setCustomNeighborhood(state, updatedCustomNeighborhood) {
    Vue.set(state, 'customNeighborhood', [...updatedCustomNeighborhood])
  },
  addChemicalCustomNeighborhood(state, chemical) {
    state.customNeighborhood.push(chemical)
  },
  removeChemicalCustomNeighborhood(state, chemId) {
    Vue.set(state, 'customNeighborhood', state.customNeighborhood.filter(neighbor => neighbor.value !== chemId))
  },
  setShowMultipleFpPopover(state, updatedShowPopover) {
    state.showMultipleFpPopover = updatedShowPopover
  },
  setMultipleFpSelections(state, updatedSelections) {
    Vue.set(state, 'multipleFpSelections', [...updatedSelections])
  },
  setMaxHybridFp(state, updatedMax) {
    state.maxHybridFp = updatedMax
  },
  setNeighborhoodGraphData(state, updatedGraphData) {
    Vue.set(state, 'neighborhoodGraphData', updatedGraphData)
  },
  setNeighborhoodLoading(state, updatedLoading) {
    state.neighborhoodLoading = updatedLoading
  },
  setGraphFps(state, updatedGraphFps) {
    state.graphFps = updatedGraphFps
  },
  setGraphNeighbors(state, updatedGraphNeighbors) {
    state.graphNeighbors = updatedGraphNeighbors
  },
  setGraphFpColors(state, updatedFpColors) {
    state.graphFpColors = updatedFpColors
  },
  setModifiedGraphFps(state, updatedGraphFps) {
    state.modifiedGraphFps = updatedGraphFps
  },
  setGraphTypes(state, updatedGraphTypes) {
    state.graphTypes = updatedGraphTypes
  },
  setSelectedGraphType(state, graphType) {
    state.selectedGraphType = graphType
  },
  setNeighborhoodGraphFilterBy(state, updatedSelBy) {
    state.neighborhoodGraphFilterBy = updatedSelBy
  },
  setPhyschemPlotUrl(state, url) {
    state.physchemPlotUrl = url
  },
  resetState(state) {
    Object.assign(state, initialState())
  },
}
