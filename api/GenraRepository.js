/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
import FakeGenraRepository from '~/api/mocks/FakeGenraRepository'

class AxiosGenraRepository {
  constructor(ctx) {
    this.utility = ctx.$utility
    this.axios = ctx.$axios
    this.axios.defaults.paramsSerializer = (params) => {
      let result = ''
      Object.keys(params).forEach((key) => {
        result += `${key}=${this.fixedEncodeURIComponent(params[key])}&`
      })
      return result.substr(0, result.length - 1)
    }
    this.settings = ctx.$endpointSettings
    this.cacheBust = () => Date.now().toString(36)
    this.chemicalSearch = this.chemicalSearch.bind(this)
    this.fixedEncodeURIComponent = str => encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`)
  }

  startsWith(searchTerm, chemicalList) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}/resource/${searchTerm}`, {
      params: {
        list: chemicalList,
      },
    }).then(data => data)
      .catch((error) => {
        if (error.response.status === 400) { return [] }
        throw (error)
      })
  }

  matchesExactly(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}/resource/${params}`)
      .then(data => data)
      .catch((error) => {
        if (error.response.status === 400) { return [] }
        throw (error)
      })
  }

  containsDetails(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}/resource/${params}`)
  }

  startsWithDetails(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}/resource/${params}`)
  }

  containsDtxsid(searchTerm, chemicalList) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}/resource/${searchTerm}`, {
      params: {
        list: chemicalList,
      },
    })
  }

  getNeighbors(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_VIEW_RADIAL}`, {
      params: {
        chem_id: params.chem_id,
        k0: params.k0,
        fp: params.fp,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        sel_by: params.sel_by,
        summarise: params.summarise,
        sumrs_by: params.sumrs_by,
        s0: params.s0,
      },
      header: {'Content-Type': 'application/json'},
    })
  }

  getSetup(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_UI_SETUP}?chem_id=${this.fixedEncodeURIComponent(params.chem_id)}${params.flags ? `&flags=${params.flags}` : ''}`)
  }

  getFingerprintHeatChartArr(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_FP_HEAT_CHART_ARRAY}`, {
      params: {
        chem_id: params.chem_id,
        k0: params.k0,
        s0: params.s0,
        fp: params.fp,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        sel_by: params.sel_by,
      },
      header: {'Content-Type': 'application/json'},
    })
  }

  getAssayGrid(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_ASSAY_GRID}`, {
      params: {
        chem_id: params.chem_id,
        k0: params.k0,
        s0: params.s0,
        fp: params.fp,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        sel_by: params.sel_by,
        summarise: params.summarise,
        sumrs_by: params.sumrs_by,
      },
      header: {'Content-Type': 'application/json'},
    })
  }

  getReadAcrossGrid(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_GENERATE_READ_ACROSS_GRID}`, {
      params: {
        chem_id: params.chem_id,
        k0: params.k0,
        s0: params.s0,
        fp: params.fp,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        summarise: params.summarise,
        sel_by: params.sel_by,
        sumrs_by: params.sumrs_by,
      },
      header: {'Content-Type': 'application/json'},
    })
  }

  async runReadAcrossGrid(params) {
    try {
      const readAcrossGrid = await this.axios.$post(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_RUN_READ_ACROSS_GRID}?${this.cacheBust()}`, {
        chem_id: params.chem_id,
        k0: params.k0,
        s0: params.s0,
        fp: params.fp,
        neg0: params.neg0,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        pos0: params.pos0,
        engine: params.engine,
        sel_by: params.sel_by,
        summarise: params.summarise,
        sumrs_by: params.sumrs_by,
        chem_inc: params.chem_inc,
        useWidth: params.useWidth,
      })
      return readAcrossGrid
    } catch (e) {
      return e
    }
  }

  async runReadAcross(params) {
    const dateString = Date.now().toString(36)
    try {
      const readAcrossChems = await this.axios.$post(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_RUN_READ_ACROSS}`, {
        chem_id: params.chem_id,
        k0: params.k0,
        s0: params.s0,
        fp: params.fp,
        ...(Object.prototype.hasOwnProperty.call(params, 'fp_weight') && {fp_weight: params.fp_weight}),
        ...(Object.prototype.hasOwnProperty.call(params, 'flags') && {flags: params.flags}),
        neg0: params.neg0,
        pos0: params.pos0,
        sel_by: params.sel_by,
        chem_inc: params.chem_inc,
        tox_inc: params.tox_inc,
      })
      return readAcrossChems
    } catch (e) {
      return e
    }
  }

  async readAcrossDownload(params) {
    try {
      const readAcrossDownload = await this.axios.post(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_GENERATE_DOWNLOAD}${params.subdir}?${this.cacheBust()}`, {
        ...params.params,
      }, {
        responseType: 'blob',
      })
      return readAcrossDownload
    } catch (e) {
      return e
    }
  }

  chemicalSearch(params) {
    return this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_CHEMICAL_SEARCH}`, {
      params: {
        txt: params,
      },
      header: {'Content-Type': 'application/json'},
      transformResponse: [
        d => JSON.parse(d).hits.map(node => ({
          chem_id: node.chem_id,
          dtxsid: node.dsstox_sid ? node.dsstox_sid : null,
          searchWord: node.name,
        })),
      ],
    })
  }

  async getGraphData(graphDataParams) {
    try {
      const graphData = await this.axios.get(`${process.env.APPLICATION_GENRA_API_BASE}${this.settings.GENRA_GRAPH_NN}`, {
        params: {
          ...graphDataParams,
        },
        header: {'Content-Type': 'application/json'},
      })
      // Headers needed for download
      return graphDataParams.download ? graphData : graphData.data
    } catch (e) {
      throw new Error(e)
    }
  }

  async getPhyschemPlot(params) {
    try {
      const urlString =
        `${process.env.APPLICATION_GENRA_API_BASE}/api/genra/v4/uiPhyschemPlot?chem_id=${encodeURIComponent(params.chem_id)}&k0=${params.k0}&s0=${params.s0}&fp=${params.fp}&sel_by=${params.sel_by}${params.fp_weight ? `&fp_weight=${encodeURIComponent(params.fp_weight)}` : ''}${params.flags ? `&flags=${params.flags}` : ''}&ftype=html`
      const plotData = await this.axios.$get(urlString)
      if (typeof plotData === 'object' && plotData.error) {
        return ''
      }
      return plotData
    } catch (e) {
      return ''
    }
  }

  async getVersionData() {
    const versionData = await this.axios.$get(`${process.env.APPLICATION_GENRA_API_BASE}/version.txt`)
    return versionData
  }
}

export default class GenraRepository {
  constructor(axios) {
    this.axios = axios
  }

  build() {
    return process.env.NODE_ENV === 'local' ?
      new FakeGenraRepository() :
      new AxiosGenraRepository(this.axios)
  }
}
