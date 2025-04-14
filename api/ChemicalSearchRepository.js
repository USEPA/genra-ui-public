/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
import FakeChemicalSearchRepository from '~/api/mocks/FakeChemicalSearchRepository'

class AxiosChemicalSearchRepository {
  constructor(ctx) {
    this.axios = ctx.$axios
    this.settings = ctx.$endpointSettings
    this.startsWith = this.startsWith.bind(this)
    this.matchesExactly = this.matchesExactly.bind(this)
  }

  startsWith(searchTerm) {
    return this.axios.$get(`${process.env.APPLICATION_CCD_API_BASE}${this.settings.CHEMICAL_SEARCH_API}${searchTerm}`)
      .then(data => data)
      .catch((error) => {
        if (error.response.status === 400) { return [] }
        throw (error)
      })
  }

  matchesExactly(params) {
    return this.axios.$get(`${process.env.APPLICATION_CCD_API_BASE}${this.settings.CHEMICAL_SEARCH_EXACT_API}${params}`)
      .then(data => data)
      .catch((error) => {
        if (error.response.status === 400) { return [] }
        throw (error)
      })
  }

  containsDetails(params) {
    return this.axios.$get(`${process.env.APPLICATION_CCD_API_BASE}${this.settings.CHEMICAL_SEARCH_CONTAIN_DETAILS_API}${params}`)
  }

  startsWithDetails(params) {
    return this.axios.$get(`${process.env.APPLICATION_CCD_API_BASE}${this.settings.CHEMICAL_SEARCH_STARTS_WITH_DETAILS_API}${params}`)
  }

  containsDtxsid(searchTerm, chemicalList) {
    return this.axios.$get(`${process.env.APPLICATION_CCD_API_BASE}${this.settings.CHEMICAL_SEARCH_CONTAIN_DTXSID_API}${searchTerm}`, {
      params: {
        list: chemicalList,
      },
    })
  }

  getMolFile(dtxid) {
    return this.axios.$get(`${process.env.APPLICATION_CCD_API_BASE}${this.settings.MOL_DOWNLOAD}${dtxid}?type=v2000`)
  }
}

export default class ChemicalSearchRepository {
  constructor(axios) {
    this.axios = axios
  }

  build() {
    return process.env.NODE_ENV === 'local' ?
      new FakeChemicalSearchRepository() :
      new AxiosChemicalSearchRepository(this.axios)
  }
}
