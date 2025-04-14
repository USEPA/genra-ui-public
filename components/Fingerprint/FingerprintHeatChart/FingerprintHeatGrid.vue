<template>
  <div class="fp-chart-container">
    <div
      id="heatgrid"
      cy-data="agHeatGrid"
      :style="`height: ${numOfAnalogues > 9 && !fingerprintRefresh ? '100%' : '500px'}; width: 100%`"
    >
      <ag-grid-vue
        class="ag-theme-balham"
        :style="`height: ${numOfAnalogues > 9 && !fingerprintRefresh ? '100%' : '450px'}; width: 100%`"
        :row-data="gridData"
        :grid-options="gridOptions"
        @cell-clicked="onCellClicked"
        @grid-ready="onGridReady"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
/* eslint-disable import/no-extraneous-dependencies */
import {
  mapState, mapGetters,
} from 'vuex'
import GenraChemicalLink from '~/components/cellRenderers/GenraChemicalLink.vue'
import HeatColoredNumber from '~/components/cellRenderers/HeatColoredNumber.vue'

export default {
  name: 'FingerprintHeatGrid',
  components: {
    GenraChemicalLink,
    HeatColoredNumber,
  },
  data() {
    return {
      gridApi: null,
      columnApi: null,
      rowData: null,
      gridOptions: {},
      sortedColumn: {},
    }
  },
  computed: {
    colormaps() {
      return this.$utility.colormaps.inferno
    },
    ...mapGetters({
      gridData: 'fingerprint/getFingerPrintGridData',
      columnDef: 'fingerprint/getFingerPrintColumnDef',
      fingerprintRefresh: 'fingerprint/getFingerprintRefreshLoading',
      params: 'getParams',
    }),
    numOfAnalogues() {
      return this.params.k0
    },
    getColumnDefs() {
      const columnDefs = this.columnDef.map((col) => {
        if (col.field !== 'name') {
          col.valueGetter = this.getHeatVal
        }
        return col
      })
      return columnDefs
    },
    ...mapState({
      heatChemicalsArr: state => state.fingerprint.heatChemicalsArr,
    }),
  },
  created() {
    this.$nuxt.$on('resetAssayFingerprintGrid', () => {
      if (this.gridOptions.columnApi !== null) {
        this.gridOptions.columnApi.applyColumnState({
          defaultState: {sort: null},
        })
      }
      if (this.gridApi !== null) {
        this.gridApi.setColumnDefs(this.getColumnDefs)
        this.gridApi.sizeColumnsToFit()
        this.gridApi.setDomLayout(this.numOfAnalogues < 10 ? 'normal' : 'autoHeight')
      }
    })
  },
  beforeDestroy() {
    this.gridApi = null
    this.gridColumnApi = null
    window.removeEventListener('load', this.handleResize)
    window.removeEventListener('resize', this.handleResize)
  },
  beforeMount() {
    this.columnDefs = this.getColumnDefs
    this.rowData = this.getGridData
    this.gridOptions = {
      domLayout: 'normal',
      rowSelection: 'multiple',
      headerHeight: 90,
      suppressContextMenu: true,
      suppressMenuHide: true,
      enableCellTextSelection: true,
      tooltipShowDelay: 0,
      components: {
      },
      defaultColDef: {
        filter: 'agTextColumnFilter',
        cellStyle: this.getColor,
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
      columnDefs: this.getColumnDefs,
    }
  },
  mounted() {
    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
  },
  methods: {
    getColor(params) {
      const column = params.column.colId
      const scaled = params.data[column]
      let retColor = ''
      try {
        retColor = this.colormaps[parseInt(72 * (1 - scaled.scaled), 10)]
      } catch (err) {
        return {
          backgroundColor: retColor,
        }
      }
      return {
        backgroundColor: retColor,
      }
    },
    getHeatVal(params) {
      const column = params.column.colId
      const value = params.data[column]
      return value.value
      // return  'N/A'
    },
    onCellClicked(e) {
    },
    onGridReady(params) {
      this.gridApi = params.api
      this.gridApi.onFilterChanged()
      window.addEventListener('load', this.handleResize)
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },
    handleResize() {
      if (this.gridApi && this.gridApi !== null) {
        this.gridApi.sizeColumnsToFit()
        this.gridApi.setDomLayout(this.numOfAnalogues > 9 ? 'autoHeight' : 'normal')
      }
    },
  },
}
</script>

<style lang="scss">
.fp-chart-container {
  position: relative;
  padding-top:10px;
  width: 100%;
  overflow: auto;
  overflow-x: auto;
}

.fp-name-icon {
  display: inline
}
.fpcell {
  width: auto;
  height: auto;
  font-size: 12px;
}
.high {
  color: white;
}

.hover:hover {
  background-color: gray;
  cursor: pointer;
}
u {
  border-bottom: 1px dotted #000;
  text-decoration: none;
}

.resetIcon:hover {
  cursor: pointer;
}
#heatgrid {
  .ag-cell-label-container {
    /*Necessary to allow for text to grow vertically*/
    height: 100% !important;
  }
  .ag-header-cell {
    padding-left: 2px !important;
    padding-right: 2px !important;
  }
  .ag-header-cell-label {
    /*Necessary to allow for text to grow vertically*/
    height: 100%;
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
    margin-top: 10px !important;
    writing-mode: vertical-lr;
    -ms-writing-mode: tb-lr;
    text-overflow: ellipsis !important;
  }
  ag-header-row {
    max-height: 70px !important;
  }
}
</style>
