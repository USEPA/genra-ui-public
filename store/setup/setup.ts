import {defineStore} from 'pinia'
import type {Params} from '../types'
import type {
  DownloadOption, FilterOption, FingerPrintOption, SetupState,
} from './types'
import type {SetupResponse} from '~/api/types'


// eslint-disable-next-line import/prefer-default-export
export const setupStore = defineStore('setup', {
  state: (): SetupState => ({
    downloadArray: [],
    validFpArray: [],
    validFilterArray: [],
  }),
  getters: {
    getValidFpArray: state => state.validFpArray,
    getValidFilterArray: state => state.validFilterArray,
    getDownloadArray: state => state.downloadArray,
  },
  actions: {
    setValidFpArray(payload: FingerPrintOption[]) {
      this.validFpArray = [...payload]
    },
    setDownloadArray(payload: DownloadOption[]) {
      this.downloadArray = [...payload]
    },
    setValidFilterArray(payload: FilterOption[]) {
      this.validFilterArray = [...payload]
    },
    async getSetup({
      chem_id: chemId, flags, params,
    }: {chem_id: string; flags: string; params: Params}): Promise<SetupResponse> {
      const setupParams = {
        ...params,
        chem_id: chemId,
        ...(flags && {flags}),
      }
      // @ts-ignore - TODO REMOVE THIS WHEN PINIA FULLY INTEGRATED
      const setupObj = await this.$repositories.genra.getSetup(setupParams)
      return setupObj
    },
  },
})
