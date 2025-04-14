export default {
  getRadialPanelLoading(state) {
    return state.radialPanelLoading
  },
  getRadialPanelRefresh(state) {
    return state.radialRefresh
  },
  getRadialPanelError(state) {
    return state.radialPanelError
  },
  getChemicals(state) {
    return state.chemicals
  },
  getNeighborChemicals(state) {
    return state.neighborChemicals
  },
  getFingerprints(state) {
    return state.fingerprints
  },
  getCustomNeighborhood(state) {
    return state.customNeighborhood
  },
  getValidFpArr(state) {
    return state.validFpArr
  },
  getFilterBy(state) {
    return state.filterBy
  },
  getLastWorkingRadialParams(state) {
    return state.lastWorkingRadialParams
  },
  getShowMultipleFpPopover(state) {
    return state.showMultipleFpPopover
  },
  getMultipleFpSelections(state) {
    return state.multipleFpSelections
  },
  getMaxHybridFp(state) {
    return state.maxHybridFp
  },
  getNeighborhoodGraphData(state) {
    return state.neighborhoodGraphData
  },
  getNeighborhoodLoading(state) {
    return state.neighborhoodLoading
  },
  getGraphFps(state) {
    return state.graphFps
  },
  getGraphNeighbors(state) {
    return state.graphNeighbors
  },
  getModifiedGraphFps(state) {
    return state.modifiedGraphFps
  },
  getGraphFpColors(state) {
    return state.graphFpColors
  },
  getGraphTypes(state) {
    return state.graphTypes
  },
  getSelectedGraphType(state) {
    return state.selectedGraphType
  },
  getNeighborhoodGraphFilterBy(state) {
    return state.neighborhoodGraphFilterBy
  },
  getPhyschemPlotUrl(state) {
    return state.physchemPlotUrl
  },
}
