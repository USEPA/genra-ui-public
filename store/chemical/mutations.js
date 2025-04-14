import initialState from './state'

export default {
  setChemical(state, selectedChemical) {
    state.chemical = {...selectedChemical}
  },
  setChemicalSelectError(state, updatedChemicalError) {
    state.chemicalSelectError = updatedChemicalError
  },
  setChemicalMolFile(state, molFile) {
    state.chemicalMolFile = molFile
  },
  setMolFileError(state, molFileError) {
    state.molFileError = molFileError
  },
  setKetcher(state, ketcher) {
    state.ketcher = ketcher
  },
  setStructure(state, structure) {
    state.molFileError = false
    state.ketcher.setMolecule(structure.data)
  },
  resetState(state) {
    Object.assign(state, initialState())
  },
  setCurrentKetcherSmileString(state, smileString) {
    state.currentKetcherSmileString = smileString
  },
}
