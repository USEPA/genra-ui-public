export default {
  setKetcherObj(vuexContext, ketcher) {
    vuexContext.commit('setKetcher', ketcher)
  },
  async loadMolFile(vuexContext, dtxid) {
    try {
      const ketcher = vuexContext.getters.getKetcher()
      const data = await this.$repositories.ChemicalSearchRepository.getMolFile(dtxid)
      // console.log(data)
      await ketcher.setMolecule(data)
    } catch (e) {
      vuexContext.commit('setErrorMessage', 'Error Retrieving Structure')
      vuexContext.commit('setErrorMolFile', true)
    }
  },
  clearMolFileError(vuexContext) {
    vuexContext.commit('setErrorMolFile', false)
    vuexContext.commit('setErrorMessage', '')
  },
  async setCurrentSmileString(vuexContext) {
    const ketcher = vuexContext.getters.getKetcher()
    const smileString = await ketcher?.getSmilesAsync()
    // console.log('smilesString: ', smileString)
    vuexContext.commit('setCurrentKetcherSmileString', smileString)
    return smileString
  },
}


