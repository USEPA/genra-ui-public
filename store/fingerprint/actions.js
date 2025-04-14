export default {
  async getFpHeatChartArr(vueContext, params) {
    try {
      const fpHeatArr = await this.$repositories.genra.getFingerprintHeatChartArr(params)
      if (this.$utility.isError(fpHeatArr)) {
        vueContext.commit('setFingerprintHeatPanelError', true)
        vueContext.commit('setErrorMsg', 'Error retrieving chemical information array for Summary Data Gap Analysis.', {root: true})
        throw new TypeError(fpHeatArr)
      }
      vueContext.dispatch('setFlagsParamFromResponse', fpHeatArr, {root: true})
      vueContext.commit('setFingerprintRefreshLoading', false)
      vueContext.commit('setFingerprintHeatPanelError', false)
      vueContext.commit('setHeatChemicalsArr', fpHeatArr.data)
      vueContext.commit('setHeatChemicalsColDefs', fpHeatArr.columns)
      vueContext.dispatch('userFeedbackToast', fpHeatArr, {root: true})
      return fpHeatArr
    } catch (err) {
      return err
    }
  },
}
