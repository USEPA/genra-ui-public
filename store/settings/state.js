export default () => ({
  EXTERNAL_LINK_URL: 'http://genra-dev.epa.gov',
  CYPRESS_BASE_URL: '/genra/',
  CCD_API_BASE: 'http://ccte-api-ccd-stg.epa.gov',
  CHEMICAL_IMAGE_API: ':9300/api/chemical-files/image/',
  CHEMICAL_SEARCH_API: ':9300/api/search/chemical/start-with/',
  CHEMICAL_SEARCH_EXACT_API: ':9300/api/search/chemical/equal/',
  CHEMICAL_SEARCH_STARTS_WITH_DETAILS_API: ':9300/api/search/chemical/start-with-details/',
  CHEMICAL_SEARCH_CONTAIN_DETAILS_API: ':9300/api/search/chemical/contain-with-details/',
  CHEMICAL_SEARCH_CONTAIN_DTXSID_API: ':9300/api/search/chemical/contain-dtxsid/',
  HELPTEXT_API: ':9300/api/helptext',
  COMPTOX_IMAGE_URL: 'https://comptox.epa.gov/dashboard/dsstoxdb/compound_image_file?source:',
  GENRA_API_BASE: 'https://ccte-api-genra-dev.epa.gov',
  GENRA_UI_SETUP: '/api/genra/v4/uiSetup/',
  GENRA_VIEW_CHEM_NN: '/api/genra/v3/viewChemNN/',
  GENRA_VIEW_RADIAL: '/api/genra/v4/uiRadialView/',
  GENRA_FP_HEAT_CHART: '/api/genra/v3/uiFingerPrintHeatChart/',
  GENRA_FP_HEAT_CHART_ARRAY: '/api/genra/v4/uiFingerPrintHeatChart',
  GENRA_IMAGE_DEV_ENDPOINT: '/api/genra/v3/viewChem/',
  GENRA_ASSAY_LIST: '/api/genra/v3/uiAssayList/',
  GENRA_ASSAY_GRID: '/api/genra/v4/uiAssayList/',
  GENRA_GENERATE_READ_ACROSS: '/api/genra/v3/uiGenerateReadAcross/',
  GENRA_GENERATE_READ_ACROSS_GRID: '/api/genra/v4/uiGenerateReadAcross/',
  GENRA_GENERATE_DOWNLOAD: '/api/genra/v4/uiDownload',
  GENRA_RUN_READ_ACROSS: '/api/genra/v3/uiRunReadAcross',
  GENRA_RUN_READ_ACROSS_GRID: '/api/genra/v4/uiRunReadAcross',
  GENRA_GRAPH_NN: '/api/genra/v4/uiFastNN/',
  GENRA_CHEMICAL_SEARCH: '/api/genra/v3/searchChems/',
  GENRA_APP_BUILD: 'STAND-ALONE',
  MOL_DOWNLOAD: ':9300/api/chemical-files/mol/by-dtxsid/',
  TITLE: 'Genra',
  ENVIRONMENT_LABEL: 'Development',
  SERVER_PORT: 3000,
  ROUTER_BASE: '/genra/',
  GA_ID: 'UA-74307760-1',
  COMPTOX_BASE_URL: 'https://comptox.epa.gov/dashboard/dsstoxdb/results?search: ',
})
