/* eslint-disable camelcase */
export default {
  async getGenraData(vueContext) {
    try {
      await vueContext.dispatch('resetDisabledButtonErrors')
      // Radial
      vueContext.commit('radial/setShowMultipleFpPopover', false)
      vueContext.commit('fingerprint/setFingerprintRefreshLoading', true)
      vueContext.commit('radial/setRadialPanelRefresh', true)
      vueContext.commit('assay/setAssayDataLoading', true)
      vueContext.commit('readAcross/setReadAcrossLoading', true)
      // Reset to GRA if RRA has been run
      if (vueContext.getters.getStep === 4) {
        vueContext.dispatch('setStep', 3)
      }

      await vueContext.dispatch('radial/getRadialData', (vueContext.getters.getParams))

      // Fingerprint Panel
      await vueContext.dispatch('fingerprint/getFpHeatChartArr', (vueContext.getters.getParams))

      // Assay
      await vueContext.dispatch('assay/getAssayGrid', (vueContext.getters.getParams))

      // ReadAcross
      await vueContext.dispatch('readAcross/getReadAcrossGrid', (vueContext.getters.getParams))

      return true
    } catch (err) {
      return false
    }
  },
  async setChemical(vueContext, {
    chemical, isRadialReset = false, fromMultiTarget = false, updateSearchBox = false, fromCustomNn = false, multiTargetFlag = '',
  }) {
    try {
      vueContext.commit('fingerprint/setFingerprintRefreshLoading', true)
      vueContext.commit('radial/setRadialPanelRefresh', true)
      vueContext.commit('assay/setAssayDataLoading', true)
      vueContext.commit('readAcross/setReadAcrossLoading', true)

      if (!chemical.chem_id) {
        vueContext.commit('chemical/setChemicalSelectError', true)
        vueContext.commit('radial/setRadialPanelError', true)
        vueContext.commit('setErrorMsg', 'Invalid Chemical Input')
        throw new Error('Invalid chemical input. Please try again.')
      }

      const currentParams = vueContext.getters.getParams

      // remove flags param if not coming from custom ne
      if (!fromCustomNn && !fromMultiTarget) {
        const {
          flags,
          ...restParams
        } = currentParams
        vueContext.commit('setParams', restParams)
      }

      // add multitarget flag
      if (fromMultiTarget) {
        vueContext.commit('setParams', {
          ...vueContext.getters.getParams,
          flags: 'multitarget',
        })
      }

      const setupData = await vueContext.dispatch('setup/getSetup', {chem_id: chemical.chem_id, ...(fromMultiTarget && {flags: multiTargetFlag})})
      if (this.$utility.isError(setupData) || this.$utility.isError(setupData.neighbor_by) || setupData.error_msg) {
        vueContext.commit('chemical/setChemicalSelectError', true)
        vueContext.commit('radial/setRadialPanelError', true)
        throw new Error(setupData.error_msg)
      }
      if (updateSearchBox) {
        window.$nuxt.$emit('updateSearchBox', setupData.chem_id)
      }
      const helpTexts = setupData.help_text
      const validNeighborBy = []
      const validFilterBy = []
      setupData.neighbor_by.forEach((itm) => {
        if (itm.data_exists) {
          validNeighborBy.push(itm)
        }
      })
      setupData.filter_by.forEach((itm) => {
        if (itm.data_exists) {
          validFilterBy.push(itm)
        }
      })
      const selectedFp = validNeighborBy[0].key
      if (this.$utility.isSetupError(validNeighborBy)) {
        vueContext.commit('chemical/setChemicalSelectError', true)
        vueContext.commit('radial/setRadialPanelError', true)
        throw new Error(setupData.error_msg)
      }

      const {
        casrn,
        chem_id,
        dsstox_cid,
        dsstox_sid,
        mol_weight,
        // eslint-disable-next-line no-shadow
        name,
        smiles,
      } = setupData
      vueContext.commit('chemical/setChemical', {
        casrn, chem_id, dsstox_cid, dsstox_sid, mol_weight, name, smiles,
      })

      vueContext.commit('setup/setFpArray', setupData.neighbor_by)
      vueContext.commit('setup/setValidFpArray', validNeighborBy)
      vueContext.commit('radial/setValidFpArr', validNeighborBy)
      vueContext.commit('radial/setMaxHybridFp', setupData.hybrid_fp_max)
      vueContext.commit('radial/setGraphFps', setupData.initGraphFPs)
      vueContext.commit('radial/setModifiedGraphFps', setupData.initGraphFPs)
      vueContext.commit('radial/setGraphTypes', setupData.graph_type)
      vueContext.commit('radial/setSelectedGraphType', setupData.graph_type[0].key)
      vueContext.commit('radial/setGraphFpColors', setupData.fpColor)
      vueContext.commit('radial/setNeighborhoodGraphFilterBy', setupData.filter_by[0].key)
      vueContext.commit('setup/setFilterArray', setupData.filter_by)
      vueContext.commit('setup/setValidFilterArray', validFilterBy)
      vueContext.commit('setup/setDownloadArray', setupData.download || [])
      vueContext.commit('helpTexts/setHelpTexts', helpTexts)

      await vueContext.dispatch('resetParams', {
        chemId: setupData.chem_id,
        fromCustomNn,
        ...(setupData.flags && {flags: setupData.flags}),
        fp: isRadialReset ? vueContext.getters.getParams.fp : selectedFp,
      })
      await vueContext.dispatch('getGenraData')
      return true
    } catch (err) {
      vueContext.commit('fingerprint/setFingerprintRefreshLoading', false)
      vueContext.commit('radial/setRadialPanelRefresh', false)
      vueContext.commit('assay/setAssayDataLoading', false)
      vueContext.commit('readAcross/setReadAcrossLoading', false)
      vueContext.commit('chemical/setChemicalSelectError', true)
      vueContext.commit('setErrorMsg', err.message || 'Error retrieving available fingerprint information for selected chemical.')
      return false
    }
  },
  async getGenraVersionData(vueContext) {
    try {
      const versionData = await this.$repositories.genra.getVersionData()
      const versionDataString = versionData.split('-')[0].replace(/[\r\n]/gm, '')
      vueContext.commit('setVersionData', versionDataString)
    } catch (e) {
      vueContext.commit('setVersionData', 'Could not get version at this time.')
    }
  },
  setStep(vueContext, step) {
    let commitStep = step > (vueContext.getters.getStepDesc.length - 1) ? (vueContext.getters.getStepDesc.length - 1) : step
    commitStep = commitStep < 0 ? 0 : commitStep
    const shouldResetReadAcrossGrid = vueContext.getters.getStep === 4 && commitStep === 3
    vueContext.commit('setStep', commitStep)
    if (shouldResetReadAcrossGrid) {
      window.$nuxt.$emit('resetReadAcrossGrid')
    }
    if (commitStep === 0) {
      vueContext.dispatch('resetState')
    }
  },
  resetState(vueContext, fp) {
    vueContext.commit('resetState', fp)
    vueContext.commit('chemical/resetState')
    vueContext.commit('radial/resetState')
    vueContext.commit('fingerprint/resetState')
    vueContext.commit('assay/resetState')
    vueContext.commit('readAcross/resetState')
  },
  setParams(vueContext, params) {
    vueContext.commit('setParams', params)
  },
  userFeedbackToast(vueContext, responseObj) {
    if (responseObj.userMsg) {
      this._vm.$bvToast.toast(responseObj.userMsg.text, {
        title: 'Alert',
        variant: responseObj.userMsg.type,
        autoHideDelay: responseObj.userMsg.delay || 10000,
        solid: true,
      })
    }
  },
  clearFpErrModal(vueContext) {
    vueContext.commit('setErrorMsg', '')
    vueContext.commit('fingerprint/setFingerprintHeatPanelLoading', false)
    vueContext.commit('fingerprint/setFingerprintRefreshLoading', false)
    vueContext.commit('assay/setAssayDataLoading', false)
  },
  setFlagsParamFromResponse(vueContext, responseObj) {
    if (responseObj.flags) {
      vueContext.commit('setParams', {
        ...vueContext.rootGetters.getParams,
        flags: responseObj.flags,
      })
    }
  },
  clearReadAcrossModal(vueContext) {
    vueContext.commit('readAcross/setReadAcrossLoading', false)
    vueContext.commit('readAcross/setReadAcrossError', false)
    vueContext.commit('setErrorMsg', '')
  },
  // eslint-disable-next-line camelcase
  resetParams(vueContext, {
    chemId, fp, flags,
  }) {
    vueContext.commit('setParams', {
      fp: fp || 'chm_mrgn',
      ...(flags && {flags}),
      k0: 10,
      sel_by: 'tox_txrf',
      chem_id: chemId,
      summarise: 'tox_txrf',
      sumrs_by: 'tox_fp',
      s0: 0.1,
      neg0: 1,
      steps: 3,
      pos0: 1,
      engine: 'genrapred',
    })
  },
  resetDisabledButtonErrors(vueContext) {
    vueContext.commit('fingerprint/setFingerprintHeatPanelError', false)
    vueContext.commit('assay/setAssayDataPanelError', false)
    vueContext.commit('readAcross/setReadAcrossStepError', false)
  },
}
