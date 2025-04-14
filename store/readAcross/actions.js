export default {
  async getReadAcrossGrid(vueContext, params) {
    try {
      const readAcrossObj = await this.$repositories.genra.getReadAcrossGrid(params)
      if (this.$utility.isError(readAcrossObj)) {
        vueContext.commit('setReadAcrossError', true)
        vueContext.commit('setReadAcrossStepError', true)
        vueContext.commit('setReadAcrossLoading', false)
        vueContext.commit('setErrorMsg', 'Error retrieving read across data.', {root: true})
        throw new TypeError(readAcrossObj)
      }
      const {
        sortOptions = [],
        data = [],
        columns = [],
        predEngines = [],
      } = readAcrossObj
      vueContext.dispatch('setFlagsParamFromResponse', readAcrossObj, {root: true})
      vueContext.commit('setReadAcrossGrid', data)
      vueContext.commit('setGraReadAcrossColumns', columns)
      vueContext.commit('setPredEngines', predEngines)
      vueContext.commit('setGraSortOptions', sortOptions)
      vueContext.commit('setGraLatestSortOption', {order: 'asc', option: sortOptions[0]?.key || ''})
      // Determine current pred engine - if all options are disabled set to null
      const currentPredEngine = predEngines?.find(predEngine => predEngine?.data_exists)
      const engine = currentPredEngine?.key || null

      vueContext.commit('setParams', {...vueContext.rootGetters.getParams, engine}, {root: true})
      vueContext.commit('setReadAcrossLoading', false)
      vueContext.commit('setReadAcrossStepError', false)
      vueContext.commit('setReadAcrossError', false)
      if (vueContext.rootGetters.getStep > 1) {
        window.$nuxt.$emit('resetReadAcrossGrid')
      }
      window.$nuxt.$emit('resetSort')
      vueContext.dispatch('userFeedbackToast', readAcrossObj, {root: true})
      return readAcrossObj
    } catch (err) {
      return err
    }
  },
  toggleSelect(vueContext, chemical) {
    const updatedChemicals = JSON.parse(JSON.stringify(vueContext.getters.getReadAcrossChemicals))
    const updatedChemicalIdx = updatedChemicals.findIndex(i => i.chem_id === chemical.chem_id)
    updatedChemicals[updatedChemicalIdx].selected = !updatedChemicals[updatedChemicalIdx].selected
    vueContext.commit('setReadAcrossChemicals', [...updatedChemicals])
  },
  toggleSelectGrid(vueContext, chemical) {
    const readAcrossCols = JSON.parse(JSON.stringify(vueContext.getters.getGraReadAcrossCols))
    const readAcrossRows = JSON.parse(JSON.stringify(vueContext.getters.getReadAcrossRows))
    const updatedChemicalIdx = readAcrossCols.findIndex(col => col.headerComponentParams.chem_id === chemical.chem_id)
    const updatedCheckBool = !readAcrossCols[updatedChemicalIdx].headerComponentParams.isChecked
    readAcrossCols[updatedChemicalIdx].headerComponentParams.isChecked = updatedCheckBool
    readAcrossRows.forEach((cell) => {
      if (Object.prototype.hasOwnProperty.call(cell, chemical.chem_id)) {
        cell[chemical.chem_id].isChecked = updatedCheckBool
      }
    })
    vueContext.commit('setGraReadAcrossColumns', readAcrossCols)
    vueContext.commit('setReadAcrossGrid', readAcrossRows)
  },
  setSimilarityWidth(vueContext, updatedSimilarityWidth) {
    const isRra = vueContext.rootGetters.getStep > 3
    const rowData = isRra ? vueContext.getters.getRunReadAcrossRows : vueContext.getters.getReadAcrossRows
    const readAcrossRows = JSON.parse(JSON.stringify(rowData))
    readAcrossRows.forEach((cell) => {
      const keys = Object.keys(cell)
      const vals = Object.values(cell)
      if (!keys.includes('physchem')) {
        keys.forEach((key, idx) => {
          if (!key.includes('_')) {
            const updObj = vals[idx]
            if (typeof updObj === 'object') {
              if (updatedSimilarityWidth) {
                updObj.useWidth = updObj.similarity
              } else {
                updObj.useWidth = false
              }
            }
          }
        })
      }
    })
    vueContext.commit('setSimilarityWidth', updatedSimilarityWidth)
    vueContext.commit(isRra ? 'setRunReadAcrossGrid' : 'setReadAcrossGrid', readAcrossRows)
  },
  // eslint-disable-next-line consistent-return
  async runReadAcross(vueContext) {
    try {
      const isCurrentRra = vueContext.rootGetters.getStep === 4
      vueContext.commit('setRunReadAcrossLoading', true)
      vueContext.commit('setReadAcrossLoading', true)
      const useSimWidth = vueContext.getters.getSimilarityWidth
      const chemIncArr = []
      const chemInc = vueContext.getters.getGraReadAcrossCols.forEach((chem) => {
        if (!chem.field.includes('_') && !(chem.field === 'physchem') && !chem.hide) {
          const chemItm = {
            chem_id: chem.headerComponentParams.chem_id,
            isChecked: chem.headerComponentParams.isChecked,
          }
          chemIncArr.push(chemItm)
        }
      })
      const params = vueContext.rootGetters.getParams
      const chemId = params.chem_id
      const {
        // eslint-disable-next-line camelcase
        k0, s0, fp, summarise, sumrs_by, pos0, neg0, engine,
      } = params
      const data = {
        chem_id: chemId,
        chem_inc: chemIncArr,
        useWidth: useSimWidth,
        k0,
        s0,
        engine,
        fp,
        summarise,
        sumrs_by,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        neg0,
        pos0,
        sel_by: params.sel_by,
      }
      const runReadAcrossGrid = await this.$repositories.genra.runReadAcrossGrid(data)
      if (this.$utility.isError(runReadAcrossGrid)) {
        vueContext.commit('setRunReadAcrossLoading', false)
        vueContext.commit('setRunReadAcrossError', true)
        vueContext.commit('setReadAcrossLoading', false)
        vueContext.commit('setErrorMsg', 'Failure in web service for running read across.', {root: true})
        throw new TypeError(runReadAcrossGrid)
      }
      vueContext.commit('setRunReadAcrossLoading', false)
      vueContext.commit('setRunReadAcrossGrid', runReadAcrossGrid.data)
      vueContext.commit('setRraReadAcrossColumns', runReadAcrossGrid.columns)
      vueContext.commit('setRraSortOptions', runReadAcrossGrid.sortOptions)
      vueContext.commit('setStep', 4, {root: true})
      window.$nuxt.$emit('updateReadAcrossData')
      if (isCurrentRra) {
        window.$nuxt.$emit('resetSort')
      }
      vueContext.commit('setReadAcrossLoading', false)
      vueContext.dispatch('userFeedbackToast', runReadAcrossGrid, {root: true})
    } catch (e) {
      vueContext.commit('setRunReadAcrossLoading', false)
      vueContext.commit('setRunReadAcrossError', true)
      vueContext.commit('setReadAcrossLoading', false)
      vueContext.commit('setErrorMsg', 'Failure in web service for running read across.', {root: true})
      return e
    }
  },

  // eslint-disable-next-line consistent-return
  async downloadReadAcross(vueContext, subdir) {
    try {
      vueContext.commit('setup/setDownloadArray', [...vueContext.rootGetters['setup/getDownloadArray']].concat([
        {
          data_exists: true, subdir: 'downloading', name: 'Downloading...',
        },
      ]), {root: true})
      vueContext.commit('setDisableDownload', true)
      vueContext.commit('setDownloadValue', 'downloading')
      const toxInc = vueContext.getters.getReadAcrossFilteredAssays
      const chemInc = vueContext.getters.getCurrentReadAcrossCols.filter(col => col.field !== 'ep_name' && col.field !== 'physchem' && !col.hide).map(chem => ({chem_id: chem.headerComponentParams.chem_id, isChecked: chem.headerComponentParams.isChecked}))
      const params = {
        ...vueContext.rootGetters.getParams,
        ...(vueContext.getters.getReadAcrossFilterApplied && {tox_inc: toxInc}),
        ...(vueContext.getters.getFilter && {filter: vueContext.getters.getFilter}),
        chem_inc: chemInc,
        rra: vueContext.rootGetters.getStep === 4,
      }
      const readAcrossDownload = await this.$repositories.genra.readAcrossDownload({params, subdir})
      const filename = this.$utility.getFileNameFromHeaders(readAcrossDownload.headers)
      await this.$export.download(readAcrossDownload.data, filename)
      vueContext.commit('setup/setDownloadArray', [...vueContext.rootGetters['setup/getDownloadArray'].filter(downloadVal => downloadVal.subdir !== 'downloading')], {root: true})
      vueContext.commit('setDownloadValue', null)
      vueContext.commit('setDisableDownload', false)
    } catch (e) {
      vueContext.commit('setup/setDownloadArray', [...vueContext.rootGetters['setup/getDownloadArray'].filter(downloadVal => downloadVal.subdir !== 'downloading')], {root: true})
      vueContext.commit('setDownloadValue', null)
      vueContext.commit('setDisableDownload', false)
      return e
    }
  },
  setPredEngine(vueContext, updatedPredEngine) {
    const params = {
      ...vueContext.rootGetters.getParams,
      engine: updatedPredEngine,
    }
    vueContext.commit('setParams', params, {root: true})
  },
}
