export default {
  getFingerprintHeatPanelLoading(state) {
    return state.fingerprintHeatPanelLoading
  },
  getFingerprintRefreshLoading(state) {
    return state.fingerprintRefreshLoading
  },
  getFingerprintHeatPanelError(state) {
    return state.fingerprintHeatPanelError
  },
  getFingerPrintGridData(state) {
    return state.heatChemicalsArr
  },
  getFingerPrintColumnDef(state) {
    const data = state.heatChemicalsColDefs.map(col => ({
      ...col, width: 40, minWidth: 30,
    }))
    return data
  },
}
