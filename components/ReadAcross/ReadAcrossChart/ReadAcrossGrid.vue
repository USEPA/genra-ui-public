<template>
  <div id="read-across-grid-container" class="ra-chartcontainer d-flex justify-content-center pl-2">
    <ag-grid-vue
      id="readacrossgrid"
      class="ag-theme-balham"
      :style="getWidth"
      :row-data="gridRowData"
      :grid-options="gridOptions"
      :context="context"
      :animate-rows="true"
      @filterChanged="filterChanged"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
/* eslint-disable quotes */
/* eslint-disable vue/no-unused-components */
/* eslint-disable vue/attribute-hyphenation */
/* eslint-disable object-curly-newline */
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapMutations} from 'vuex'
import ReadAcrossDataGridColumnHeader from '~/components/ReadAcross/ReadAcrossChart/ReadAcrossChartHeaders/ReadAcrossDataGridColumnHeader.vue'
import PlainText from '~/components/ReadAcross/ReadAcrossCell/PlainText.vue'
import RedBlueTooltip from '~/components/ReadAcross/ReadAcrossCell/RedBlueTooltip.vue'
import ContinuousPredObs from '~/components/ReadAcross/ReadAcrossCell/ContinuousPredObs.vue'
import MultiCategory from '~/components/ReadAcross/ReadAcrossCell/MultiCategory.vue'

export default {
  name: 'ReadAcrossGrid',
  components: {
    agColumnHeader: ReadAcrossDataGridColumnHeader,
    RedBlueTooltip,
    PlainText,
    ContinuousPredObs,
    MultiCategory,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      simChecked: false,
      gridOptions: {},
      context: null,
      gridRowData: null,
    }
  },
  computed: {
    ...mapGetters({
      readAcrossChemicals: 'readAcross/getReadAcrossChemicals',
      assayChemicals: 'assay/getAssayChemicals',
      simWidth: 'readAcross/getSimilarityWidth',
      showPagination: 'readAcross/getShowPagination',
      readAcrossData: 'readAcross/getReadAcrossRows',
      runReadAcrossData: 'readAcross/getRunReadAcrossRows',
      readAcrossGridColumns: 'readAcross/getCurrentReadAcrossCols',
      currentStep: 'getStep',
    }),
    gridColumns() {
      const newCols = JSON.parse(JSON.stringify(this.readAcrossGridColumns))
      const returnCols = newCols.map((col) => {
        if (col.field !== 'ep_name') {
          const {cellRenderer, ...resCol} = col
          resCol.cellRendererSelector = (params) => {
            const component = params?.value?.cellRenderer
            if (component) {
              return {
                component,
              }
            }
            // eslint-disable-next-line no-undefined
            return undefined
          }
          return resCol
        }
        return col
      })
      return returnCols
    },
    autoGroupColumnDef() {
      const {hide, suppressColumnsToolPanel, ...autoGroupColumnDef} = this.gridColumns.find(col => col.field === 'ep_name')
      return autoGroupColumnDef
    },
    paginationPageSize() {
      return this.showPagination ? 15 : 50000
    },
    rowData() {
      return this.currentStep > 3 ? this.runReadAcrossData : this.readAcrossData
    },
    getWidth() {
      const hiddenColumnsCount = this.gridColumns.filter(col => col.hide).length - 1
      return `width: ${((this.gridColumns.length - hiddenColumnsCount) * 110) + 70}px`
    },
  },
  created() {
    this.$nuxt.$on('setReadAcrossPagination', () => {
      if (this.gridApi) {
        if (!this.showPagination) {
          this.gridApi.paginationSetPageSize(50000)
        } else {
          this.gridApi.paginationSetPageSize(15)
          this.handleResize()
        }
      }
    })
    this.$nuxt.$on('updateReadAcrossData', () => {
      if (this.gridApi) {
        const rowIndex = this.findRowGroupIdx()
        const isPhsychemExpanded = this.gridApi.getModel().getRow(rowIndex).expanded
        this.gridApi.setColumnDefs(this.gridColumns)
        this.gridApi.setRowData(this.rowData)
        this.restorePhyschemExpanded(isPhsychemExpanded, rowIndex)
      }
    })
    this.$nuxt.$on('resetPagination', () => {
      this.currentPage = 1
    })
    this.$nuxt.$on('similarChecked', () => {
      if (this.gridApi) {
        const rowIndex = this.findRowGroupIdx()
        const isPhsychemExpanded = this.gridApi.getModel().getRow(rowIndex).expanded
        this.gridApi.setRowData(this.rowData)
        this.restorePhyschemExpanded(isPhsychemExpanded, rowIndex)
      }
    })
    this.$nuxt.$on('resetReadAcrossGrid', (fromResetRra = false) => {
      if (this.gridApi && this.gridApi !== null) {
        const rowIndex = this.findRowGroupIdx()
        const isPhsychemExpanded = this.gridApi.getModel().getRow(rowIndex).expanded
        if (!fromResetRra) {
          this.setSimWidth(false)
          this.gridApi.setColumnDefs([])
        }
        this.gridApi.setColumnDefs(this.gridColumns)
        this.gridApi.setRowData(this.rowData)
        this.restorePhyschemExpanded(isPhsychemExpanded, rowIndex)
        this.gridApi.paginationGoToPage(0)
      }
    })
    // eslint-disable-next-line consistent-return
    this.$nuxt.$on('toggleSelect', (colId) => {
      if (this.currentStep > 3) {
        this.$nuxt.$emit('showVerifyChange')
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.gridApi !== null) {
          this.gridApi.forEachNode((rowNode) => {
            if (!rowNode.phsychem && !rowNode.group) {
              const copyRow = JSON.parse(JSON.stringify(rowNode.data[colId]))
              copyRow.isChecked = !copyRow.isChecked
              rowNode.setDataValue(colId, copyRow)
            }
          })
          this.gridApi.setColumnDefs(this.gridColumns)
        }
      }
    })

    this.$nuxt.$on('sortGrid', ({columnState}) => {
      if (this.gridColumnApi) {
        this.gridColumnApi.applyColumnState(columnState)
      }
    })
  },
  beforeMount() {
    this.gridOptions = {
      valueCache: true,
      rowSelection: 'multiple',
      headerHeight: 150,
      suppressContextMenu: true,
      enableCellTextSelection: true,
      pagination: true,
      suppressMakeColumnVisibleAfterUnGroup: true,
      paginationPageSize: this.paginationPageSize,
      suppressChangeDetection: true,
      tooltipShowDelay: 0,
      postSortRows: ({nodes: rowNodes}) => {
        let nextInsertPos = 0
        for (let i = 0; i < rowNodes.length; i += 1) {
          if (rowNodes[i].group) {
            const sortedRowChildren = rowNodes[i].allLeafChildren.sort((a, b) => {
              if (a.data.ep_name > b.data.ep_name) {
                return 1
              }
              if (b.data.ep_name > a.data.ep_name) {
                return -1
              }
              return 0
            })
            rowNodes[i].childrenAfterSort = sortedRowChildren
            rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0])
            nextInsertPos += 1
          }
        }
      },
      autoGroupColumnDef: this.autoGroupColumnDef,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        minWidth: 65,
        maxWidth: 110,
        sortable: true,
        resizable: true,
        equals: (oldCol, newCol) => {
          if (oldCol && newCol) {
            const checkedEquals = oldCol.isChecked === newCol.isChecked
            const predictionEquals = oldCol.isPrediction === newCol.isPrediction
            const similarityEquals = oldCol.similarity === newCol.similarity
            const useWidthEquals = oldCol.useWidth === newCol.useWidth
            const valueEquals = oldCol.value === newCol.value
            return checkedEquals && predictionEquals && similarityEquals && useWidthEquals && valueEquals
          }
          return true
        },
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
    this.context = {componentParent: this}
    this.gridRowData = this.rowData
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
    ...mapMutations({
      setReadAcrossFilterApplied: 'readAcross/setReadAcrossFilterApplied',
      setReadAcrossFilteredAssays: 'readAcross/setReadAcrossFilteredAssays',
      setSimWidth: 'readAcross/setSimilarityWidth',
      setFilter: 'readAcross/setFilter',
    }),
    filterChanged(e) {
      const currentFilter = this.gridApi?.getFilterModel()['ag-Grid-AutoColumn']?.filter
      this.setFilter(currentFilter || "")
    },
    redrawAllRows() {
      this.gridApi.redrawRows()
    },
    onGridReady(params) {
      this.gridApi = this.gridOptions.api
      this.gridColumnApi = this.gridOptions.columnApi
      this.handleResize()
    },
    handleResize() {
      if (this.showPagination && this.gridApi) {
        const containerEle = document.getElementById('read-across-grid-container')
        const containerHeight = containerEle.getBoundingClientRect().height
        const currentPaginationPageSize = this.gridApi.paginationGetPageSize()
        if (containerHeight > 730 && currentPaginationPageSize <= 15) {
          this.gridApi.paginationSetPageSize(25)
        }
        if (containerHeight <= 730 && currentPaginationPageSize > 15) {
          this.gridApi.paginationSetPageSize(15)
        }
      }
    },
    findRowGroupIdx() {
      // eslint-disable-next-line consistent-return
      this.gridApi.forEachNode((row) => {
        if (row.group) {
          return row.rowIndex
        }
      })
      return 0
    },
    restorePhyschemExpanded(isPhsychemExpanded, rowIndex) {
      if (this.gridApi) {
        this.gridApi.getModel().getRow(rowIndex).setExpanded(isPhsychemExpanded)
      }
    },
  },
}

</script>

<style lang="scss">
.ra-chartcontainer {
  display: inline-block;
  width: 100%;
  /* overflow: auto; */
  height: 53vh;
  min-height: 500px;
}
.ag-cell-value {
  height: 100%;
}

#readacrossgrid {
  height: 100%;
  width:100%;
  margin-top: 5px;
  padding-right: 10px;
  padding-bottom: 10px;
   .ag-cell-label-container {
    /*Necessary to allow for text to grow vertically*/
    height: 100% !important;
  }
  .ag-cell-wrapper {
    height: 100%;
  }
  .ag-header-cell {
    padding-left: 2px !important;
    padding-right: 2px !important;
  }
  .ag-cell .ag-cell-not-inline-editing .ag-cell-auto-height .ag-cell-focus {
    border-bottom: 2px solid white !important;
    line-height: 26px;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .ag-cell, .ag-theme-balham .ag-full-width-row .ag-cell-wrapper.ag-row-group {
    border-bottom: 2px solid white !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .ag-cell-value {
    display:inline-block !important;
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
.target-column-header {
  border-right: 4px dotted #ccc;
  border-left: 4px dotted #ccc;
}
</style>
