<template>
  <div id="assaygridcyp" class="assay-gridcontainer pl-2">
    <ag-grid-vue
      id="assaygrid"
      class="ag-theme-balham"
      style="height: 100%; width:100%"
      :row-data="rowData"
      :grid-options="gridOptions"
      @cell-clicked="onCellClicked"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
/* eslint-disable quotes */
/* eslint-disable vue/attribute-hyphenation */
/* eslint-disable object-curly-newline */
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'

export default {
  name: 'AssayDataGrid',
  data() {
    return {
      gridApi: null,
      columnApi: null,
      frameworkComponents: null,
      gridOptions: {},
    }
  },
  computed: {
    ...mapGetters({
      chemicals: 'assay/getAssayChemicals',
      rowData: 'assay/getAssayGridRows',
      gridColumns: 'assay/getAssayGridCols',
      showPagination: 'assay/getShowPagination',
      params: 'getParams',
    }),
    tooltipValueGetter(params) {
      return params.location === 'header' ? {value: params.value} : {value: 'hi'}
    },
    numOfAnalogues() {
      return this.params.k0
    },
    adjustedPageSize() {
      if (this.numOfAnalogues > 14) {
        return 13
      }
      if (this.numOfAnalogues > 13) {
        return 12
      }
      if (this.numOfAnalogues > 11) {
        return 10
      }
      return 9
    },
  },
  created() {
    this.$nuxt.$on('resetPagination', () => {
      this.currentPage = 1
    })
    this.$nuxt.$on('setAssayPagination', (paginate) => {
      if (this.gridApi !== null) {
        if (!paginate) {
          this.gridApi.paginationSetPageSize(50000)
        } else {
          this.gridApi.paginationSetPageSize(this.getPageSizeForWindow())
        }
      }
    })
    this.$nuxt.$on('resetAssayFingerprintGrid', () => {
      if (this.gridApi !== null) {
        this.gridApi.setRowData(this.rowData)
        this.gridApi.setColumnDefs([])
        this.gridApi.setColumnDefs(this.gridColumns)
        this.gridApi.paginationSetPageSize(this.getPageSizeForWindow())
        this.gridApi.paginationGoToPage(0)
        this.gridApi.sizeColumnsToFit()
      }
    })
  },
  beforeMount() {
    this.gridOptions = {
      valueCache: true,
      rowSelection: 'multiple',
      headerHeight: 90,
      suppressContextMenu: true,
      suppressMenuHide: true,
      enableCellTextSelection: true,
      pagination: true,
      // eslint-disable-next-line no-nested-ternary
      paginationPageSize: this.showPagination ? this.adjustedPageSize : 5000,
      tooltipShowDelay: 0,
      components: {
      },
      defaultColDef: {
        filter: 'agTextColumnFilter',
        cellStyle: this.getColor,
        cellRenderer: params => '<div></div>',
        minWidth: 30,
        maxWidth: 90,
        sortable: true,
        resizable: true,
      },
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'center',
          },
          {statusPanel: 'agFilteredRowCountComponent'},
          {statusPanel: 'agSelectedRowCountComponent'},
          {statusPanel: 'agAggregationComponent'},
        ],
      },
      columnDefs: this.gridColumns,

    }
    this.tooltipShowDelay = 0
  },
  mounted() {
    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    window.addEventListener('load', this.handleResize)
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    this.gridApi = null
    this.gridColumnApi = null
    window.removeEventListener('load', this.handleResize)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    getColor(params) {
      const column = params.column.colId
      const val = params.data[column]
      let retColor = {backgroundColor: 'black', borderRight: '.5px solid white', borderBottom: '.5px solid white'}
      if (!val) {
        retColor = {backgroundColor: 'lightgrey', borderRight: '.5px solid white', borderBottom: '.5px solid white'}
      }
      return retColor
    },
    onCellClicked(e) {
    },
    onGridReady(params) {
      this.gridApi.onFilterChanged()
      window.addEventListener('load', this.handleResize)
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },
    handleResize() {
      if ((this.gridColumnApi && this.gridColumnApi !== null) && (this.gridApi && this.gridApi !== null)) {
        this.gridApi.sizeColumnsToFit()
        this.gridColumnApi.resetColumnState()
      }
    },
    getPageSizeForWindow() {
      return window.innerWidth < 992 ? 8 : this.adjustedPageSize
    },
  },
}

</script>

<style lang="scss">
.assay-gridcontainer {
  margin: auto;
  display: inline-block;
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  // height: 53vh;
}

#assaygrid {
  height: 100%;
  width:100%;
  margin-top: 5px;
  padding-right: 10px;
  padding-bottom: 10px;
  .ag-cell-label-container {
    /*Necessary to allow for text to grow vertically*/
    height: 105px !important;
  }
  .ag-header-cell {
    padding-left: 2px !important;
    padding-right: 2px !important;
  }
  .ag-header-cell-label {
    /*Necessary to allow for text to grow vertically*/
    height: 85px;
    margin-top: 5px;
    padding: 0 !important;
  }
  .ag-cell .ag-cell-not-inline-editing .ag-cell-auto-height .ag-cell-focus {
    border: 1px solid transparent;
    line-height: 26px;
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  .ag-cell, .ag-theme-balham .ag-full-width-row .ag-cell-wrapper.ag-row-group {
   padding-left: 4px !important;
   padding-right: 4px !important;
  }
  .ag-header-cell-label .ag-header-cell-text {
    /*Force the width corresponding at how much width
      we need once the text is laid out vertically*/
    width: auto;
    margin-top: 0px !important;
    writing-mode: vertical-lr;
    height: 100%;
    overflow: hidden;
    -ms-writing-mode: tb-lr;
    text-overflow: ellipsis !important;
  }
  ag-header-row {
    max-height: 70px !important;
  }
}
.custom-tooltip {
  position: absolute;
  width: fit-content;
  max-width: 300px;
  word-break:break-all;
  word-wrap: break-word;
  height: fit-content;
  display: flex;
  border: 1px solid grey;
  /* overflow: hidden; */
  pointer-events: none;
  transition: opacity .2s;
}

.custom-tooltip.ag-tooltip-hiding {
  opacity: 0;
}

.custom-tooltip p {
  padding: 5px
}

</style>
