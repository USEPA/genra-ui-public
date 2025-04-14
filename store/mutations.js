export default {
  setStep(state, step) {
    state.step = step
  },
  setParams(state, updatedParams) {
    state.params = {...updatedParams}
  },
  setErrorMsg(state, updatedMsg) {
    state.errorMsg = updatedMsg
  },
  resetState(state, fp = 'chm_mrgn') {
    state.params = {
      fp: fp,
      k0: 10,
      sel_by: 'tox_txrf',
      chem_id: '',
      summarise: 'tox_txrf',
      sumrs_by: 'tox_fp',
      s0: 0.1,
      neg0: 1,
      steps: 3,
      pos0: 1,
      engine: 'genrapred',
    }
    state.step = 0
    state.errorMsg = ''
  },
  setShowEpaHeader(state) {
    state.showEpaHeader = !state.showEpaHeader
  },
  setShowAbout(state, show) {
    state.showAbout = show
  },
  setVersionData(state, data) {
    state.versionData = data
  },
}
