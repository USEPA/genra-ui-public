/* eslint-disable camelcase */
export default {
  async getRadialData(vueContext, params) {
    try {
      const neighborsObj = await this.$repositories.genra.getNeighbors(params)
      if (this.$utility.isError(neighborsObj) || this.$utility.isRadialError(neighborsObj) || this.$utility.isRadialError(neighborsObj.result) || this.$utility.isError(neighborsObj.result)) {
        vueContext.commit('chemical/setChemicalSelectError', true, {root: true})
        vueContext.commit('setRadialPanelError', true)
        vueContext.commit('setErrorMsg', 'Error retrieving chemical information for selected fingerprint.', {root: true})
        throw new TypeError(neighborsObj)
      }
      vueContext.commit('setParams', {
        ...vueContext.rootGetters.getParams,
        sel_by: neighborsObj.sel_by,
        summarise: neighborsObj.report_db[0].key,
        sumrs_by: neighborsObj.report_db[0].subFields[0].key,
        ...(neighborsObj.flags && {flags: neighborsObj.flags}),
      }, {root: true})
      const graphData = await vueContext.dispatch('getGraphData', ({
        ...vueContext.rootGetters.getParams, k0: vueContext.getters.getGraphNeighbors, fp: vueContext.getters.getGraphFps.join(','), graph_type: vueContext.getters.getSelectedGraphType,
      }))
      const plotUrl = await vueContext.dispatch('getPhyschemPlot')
      vueContext.commit('setPhyschemPlotUrl', plotUrl)
      vueContext.commit('setNeighborChemicals', neighborsObj.result)
      vueContext.commit('setChemicals', neighborsObj.result)
      vueContext.commit('assay/setAssayInputOptions', neighborsObj.report_db, {root: true})
      vueContext.commit('setRadialPanelRefresh', false)
      vueContext.commit('setRadialPanelLoading', false)
      vueContext.commit('setLastWorkingRadialParams', vueContext.rootGetters.getParams)
      if (vueContext.getters.getNeighborChemicals.length > 0 && vueContext.rootGetters.getStep < 1) {
        vueContext.commit('setStep', 1, {root: true})
      }
      vueContext.commit('setNeighborhoodGraphData', graphData)
      vueContext.dispatch('userFeedbackToast', neighborsObj, {root: true})
      return neighborsObj
    } catch (err) {
      return err
    }
  },
  async getGraphData(vueContext, params) {
    try {
      const graphData = await this.$repositories.genra.getGraphData(params)
      return graphData
    } catch (err) {
      return []
    }
  },
  async getPhyschemPlot(vueContext) {
    const plotData = await this.$repositories.genra.getPhyschemPlot({
      ...vueContext.rootGetters.getParams,
    })
    return plotData
  },
  async updateGraph(vueContext, updatedFps) {
    try {
      vueContext.commit('setNeighborhoodLoading', true)
      const {selectedGraphType: graph_type, selectedSelBy: sel_by} = updatedFps
      const fp = updatedFps.modifiedFps.join(',')
      vueContext.commit('setModifiedGraphFps', updatedFps.modifiedFps)
      vueContext.commit('setSelectedGraphType', graph_type)
      vueContext.commit('setNeighborhoodGraphFilterBy', sel_by)
      const k0 = vueContext.getters.getGraphNeighbors
      const {
        s0, steps, chem_id,
      } = vueContext.rootGetters.getParams
      const updatedData = await this.$repositories.genra.getGraphData({
        k0, s0, fp, sel_by, steps, chem_id, graph_type,
      })
      if (!updatedData.edges.length && !Object.keys(updatedData.nodes).length) {
        vueContext.commit('setNeighborhoodLoading', false)
      }
      return updatedData
    } catch (e) {
      throw new Error(e)
    }
  },
  async getExpandedNodes(vueContext, node) {
    try {
      vueContext.commit('setNeighborhoodLoading', true)
      const {
        chem_id,
      } = node
      const {
        s0,
      } = vueContext.rootGetters.getParams
      const modifiedFps = vueContext.getters.getModifiedGraphFps
      const fp = modifiedFps.join(',')
      const sel_by = vueContext.getters.getNeighborhoodGraphFilterBy
      const k0 = vueContext.getters.getGraphNeighbors
      const graph_type = vueContext.getters.getSelectedGraphType
      const expandedData = await this.$repositories.genra.getGraphData({
        k0, s0, fp, sel_by, steps: 1, chem_id, graph_type,
      })
      return expandedData
    } catch (e) {
      throw new Error(e)
    }
  },
  inputChangeHandler(vueContext, val) {
    const {ev: inputParam, inputOption} = val
    if (inputOption === 'neighbor_by') {
      vueContext.dispatch('hybridFpReset')
    }
    const paramKey = this.$utility.getParamKey(inputOption)
    // eslint-disable-next-line camelcase
    const {fp_weight, ...newParams} = vueContext.rootGetters.getParams
    const updatedParams = inputOption === 'neighbor_by' ? newParams : vueContext.rootGetters.getParams
    vueContext.commit('setRadialPanelRefresh', true)
    vueContext.dispatch('setParams', {...updatedParams, [paramKey]: inputParam}, {root: true})
    vueContext.dispatch('getGenraData', null, {root: true})
    if (vueContext.rootGetters.getStep > 3) {
      vueContext.dispatch('setStep', 3, {root: true})
    }
    window.$nuxt.$emit('refreshRadialData')
  },
  hybridFpAddHandler(vueContext, fpData) {
    const {prevFp, selectedFp} = fpData
    const copyFpSelectionArr = JSON.parse(JSON.stringify(vueContext.getters.getMultipleFpSelections))
    const copyFpArr = JSON.parse(JSON.stringify(vueContext.getters.getValidFpArr))
    // Handle changing already selected FP
    if (copyFpSelectionArr.some(fp => fp.value === selectedFp)) {
      const selectedFpIdx = copyFpArr.findIndex(fp => fp.key === selectedFp)
      copyFpArr[selectedFpIdx] = {...copyFpArr[selectedFpIdx], data_exists: true}
      const disableIdx = copyFpArr.findIndex(fp => fp.key === prevFp)
      copyFpArr[disableIdx] = {...copyFpArr[disableIdx], data_exists: false}
      vueContext.commit('setValidFpArr', copyFpArr)

      const existingFpIdx = copyFpSelectionArr.findIndex(fp => fp.value === selectedFp)
      copyFpSelectionArr[existingFpIdx] = {
        ...copyFpSelectionArr[existingFpIdx], value: prevFp, rangeValue: 1,
      }
      vueContext.commit('setMultipleFpSelections', copyFpSelectionArr)
      return
    }

    // Handle disabling selection from other select's
    const selectedIdx = copyFpArr.findIndex(fp => fp.key === prevFp)
    copyFpArr[selectedIdx] = {...copyFpArr[selectedIdx], data_exists: false}

    vueContext.commit('setValidFpArr', copyFpArr)

    // If new selection add to Array
    copyFpSelectionArr.splice(copyFpSelectionArr.length, 0, {
      value: prevFp,
      rangeValue: 1,
    })
    vueContext.commit('setMultipleFpSelections', copyFpSelectionArr)
  },
  hybridFpRemoveHandler(vueContext, fpRemove) {
    const copyFpSelectionArr = JSON.parse(JSON.stringify(vueContext.getters.getMultipleFpSelections)).filter(fp => fp.value !== fpRemove)
    const copyFpArr = JSON.parse(JSON.stringify(vueContext.getters.getValidFpArr))
    const selectedFpIdx = copyFpArr.findIndex(fp => fp.key === fpRemove)
    copyFpArr[selectedFpIdx].data_exists = true
    vueContext.commit('setMultipleFpSelections', copyFpSelectionArr)
    vueContext.commit('setValidFpArr', copyFpArr)
  },
  hybridFpRangeHandler(vueContext, fpParams) {
    const {prevFp, selectedFp} = fpParams
    const copyFpSelectionArr = JSON.parse(JSON.stringify(vueContext.getters.getMultipleFpSelections))
    const idx = copyFpSelectionArr.findIndex(id => id.value === prevFp)

    copyFpSelectionArr[idx].rangeValue = selectedFp
    vueContext.commit('setMultipleFpSelections', copyFpSelectionArr)
  },
  hybridFpSubmitHandler(vueContext) {
    const fpWeightObj = vueContext.getters.getMultipleFpSelections.reduce((acc, cv) => {
      acc.fp.push(cv.value)
      acc.weights.push(cv.rangeValue)
      return acc
    }, {fp: [], weights: []})
    const fingerprints = fpWeightObj.fp.join()
    const fpWeights = fpWeightObj.weights.join()
    vueContext.commit('setRadialPanelRefresh', true)
    vueContext.dispatch('setParams', {
      ...vueContext.rootGetters.getParams, fp: fingerprints, fp_weight: fpWeights,
    }, {root: true})
    vueContext.dispatch('getGenraData', null, {root: true})
    window.$nuxt.$emit('refreshRadialData')
    if (vueContext.rootGetters.getStep > 3) {
      vueContext.dispatch('setStep', 3, {root: true})
    }
    vueContext.commit('setShowMultipleFpPopover', false)
  },
  hybridFpReset(vueContext) {
    vueContext.commit('setMultipleFpSelections', [])
    vueContext.commit('setValidFpArr', [...vueContext.rootGetters['setup/getValidFpArray']])
    vueContext.commit('setShowMultipleFpPopover', false)
  },
  async startGenraFromNeighborhoodGraph(vueContext, {
    chemId, chemName = '', fromCustomNn = false,
  }) {
    vueContext.commit('setNeighborhoodLoading', true)
    if (vueContext.rootGetters.getStep !== 1) {
      vueContext.dispatch('setStep', 1, {root: true})
    }

    const {
      flags, ...params
    } = vueContext.rootGetters.getParams

    vueContext.dispatch('setParams', {
      ...params,
      ...(fromCustomNn && {flags: 'usernn'}),
    }, {root: true})
    window.$nuxt.$emit('hideNeighborhoodGraphModal')
    window.$nuxt.$emit('updateSearchBox', `${chemName} ${chemId}`)
    vueContext.commit('setNeighborhoodLoading', false)
    await vueContext.dispatch('setChemical', {chemical: {chem_id: chemId}, fromCustomNn}, {root: true})
  },
  async downloadRadial(vueContext, subdir) {
    const params = {
      ...vueContext.rootGetters.getParams,
    }
    const radialDownload = await this.$repositories.genra.readAcrossDownload({params, subdir})
    const filename = this.$utility.getFileNameFromHeaders(radialDownload.headers)
    await this.$export.download(radialDownload.data, filename)
  },

}
