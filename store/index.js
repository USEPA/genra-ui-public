// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'

const data = () => ({
  step: 0,
  stepDesc: [
    'Step One: Select a Chemical',
    'Step Two: Analog Identification and Evaluation',
    'Step Three: Data Gap Analysis & Generate Data Matrix',
    'Step Four: Run GenRA Prediction',
    'Step Five: Filter by Endpoint or Analogs',
  ],
  errorMsg: '',
  params: {
    fp: 'chm_mrgn',
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
  },
  showEpaHeader: true,
  showAbout: false,
  versionData: '',
})

// Factory function to reset state
const initialState = data()

export const strict = false
export default {
  state: data,
}
