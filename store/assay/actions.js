/* eslint-disable camelcase */
export default {
  async getAssayData(vueContext, params) {
    try {
      const assayObj = await this.$repositories.genra.getAssayList(params)
      return assayObj
    } catch (err) {
      return err
    }
  },

  async assayInputChangeHandler(vueContext, inputObj) {
    try {
      vueContext.commit('setAssayDataLoading', true)
      vueContext.commit('readAcross/setReadAcrossLoading', true, {root: true})
      const {ev: inputParam, inputOption} = inputObj
      const paramKey = this.$utility.getParamKey(inputOption)
      const updatedParams = vueContext.rootGetters.getParams
      // Handle selecting first available Buy parameters if Group input changes
      const sumrs_by = paramKey === 'summarise' ?
        vueContext.getters.getAssayInputOptions.find(val => val.key === inputParam).subFields
          .find(subField => subField.data_exists).key : null
      vueContext.dispatch('setParams', {
        ...updatedParams, ...(sumrs_by !== null && {sumrs_by}), [paramKey]: inputParam,
      }, {root: true})
      if (vueContext.rootGetters.getStep > 3) {
        vueContext.dispatch('setStep', 3, {root: true})
      }
      await vueContext.dispatch('getAssayGrid', (vueContext.rootGetters.getParams))
      await vueContext.dispatch('readAcross/getReadAcrossGrid', (vueContext.rootGetters.getParams), {root: true})
      return true
    } catch (err) {
      return err
    }
  },

  async getAssayGrid(vueContext, params) {
    try {
      const assayObj = await this.$repositories.genra.getAssayGrid(params)
      if (this.$utility.isError(assayObj) || this.$utility.isError(assayObj.data) || this.$utility.isError(assayObj.columns)) {
        vueContext.commit('fingerprint/setFingerprintHeatPanelError', true, {root: true})
        vueContext.commit('setAssayDataPanelError', true)
        vueContext.commit('setErrorMsg', 'Error retrieving chemical information for Assay Data Panel.', {root: true})
        throw new TypeError('Assay Data Failed')
      }
      vueContext.dispatch('setFlagsParamFromResponse', assayObj, {root: true})
      vueContext.commit('setAssayColumns', assayObj.columns)
      vueContext.commit('setAssayRows', assayObj.data)
      vueContext.commit('fingerprint/setFingerprintHeatPanelLoading', false, {root: true})
      vueContext.commit('setAssayDataLoading', false)
      vueContext.commit('setAssayDataPanelError', false)
      if (vueContext.rootGetters.getStep > 1) {
        window.$nuxt.$emit('resetAssayFingerprintGrid')
      }
      vueContext.dispatch('userFeedbackToast', assayObj, {root: true})
      return assayObj
    } catch (err) {
      return err
    }
  },
}
