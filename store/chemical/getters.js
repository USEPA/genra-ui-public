export default {
  getChemical(state) {
    return state.chemical
  },
  getChemicalSelectError(state) {
    return state.chemicalSelectError
  },
  getKetcher: state => () => state.ketcher,
  getMolFile: state => () => state.chemicalMolFile,
  getCurrentKetcherSmileString: state => () => state.currentKetcherSmileString,
  getErrorMolFile: state => state.errorMolFile,
  getErrorMessage: state => state.errorMessage,
}
