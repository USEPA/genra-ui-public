// eslint-disable-next-line import/no-extraneous-dependencies

export default {
  setFpArray(state, fpArray) {
    state.fpArray = [...fpArray]
  },
  setValidFpArray(state, validFpArray) {
    state.validFpArray = [...validFpArray]
  },
  setFilterArray(state, filterArray) {
    state.filterArray = [...filterArray]
  },
  setValidFilterArray(state, validFilterArray) {
    state.validFilterArray = [...validFilterArray]
  },
  setDownloadArray(state, downloadArray) {
    state.downloadArray = [...downloadArray]
  },
}
