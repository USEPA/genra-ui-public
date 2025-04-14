<template>
  <div class="ag-read-across-custom-header-cell-label-container" role="presentation" :style="{opacity: opacity}">
    <div ref="eLabel" class="ag-read-across-custom-header-cell-label" role="presentation" @click="columnClickHandler">
      <p v-if="chem_id !== 'ep_name'" class="ag-read-across-custom-header-cell-text-sim-value">
        {{ Number.parseFloat(similarity).toFixed(2) }}
        <span v-if="targetChem" class="ag-read-across-custom-header-cell-text-sim-value-icon-target">
          {{ '&#8858;' }}
        </span>
        <span v-else-if="isChecked && !targetChem" class="ag-read-across-custom-header-cell-text-sim-value-icon-check">
          {{ '&#10004;' }}
        </span>
        <span v-else class="ag-read-across-custom-header-cell-text-sim-value-icon-x">
          {{ '&#10008;' }}
        </span>
      </p>
      <img v-if="chem_id !== 'ep_name'" class="ag-read-across-custom-header-chem-image" :src="imageUrl(chem_id)">
      <p ref="eText" class="ag-read-across-custom-header-cell-text">
        <!-- eslint-disable-next-line vue/no-parsing-error -->
        {{ name.length < 13 || (chem_id === 'ep_name' ) ? name : name.substring(0, 12) + '...' }}
        <span v-if="enableMenu" ref="menuButton" class="ag-read-across-custom-header-menu-button" @click="onMenuClicked($event)">
          <b-icon icon="list" aria-label="Read Across Menu" />
        </span>
      </p>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'ReadAcrossDataGridColumnHeader',
  data() {
    return {
      ascSort: null,
      descSort: null,
      noSort: null,
      isChecked: false,
      name: '',
      targetChem: false,
      enableSorting: false,
      chem_id: '',
      enableMenu: false,
      similarity: 0,
      column: {},
    }
  },
  computed: {
    ...mapGetters({
      gridColumns: 'readAcross/getCurrentReadAcrossCols',
      currentStep: 'getStep',
    }),
    opacity() {
      return this.isChecked ? 1 : 0.5
    },
  },
  beforeMount() {
    this.isChecked = this.params.isChecked
    this.name = this.params.name
    this.targetChem = this.params.targetChem
    this.enableSorting = this.params.enableSorting
    this.chem_id = this.params.chem_id
    this.enableMenu = this.params.enableMenu
    this.similarity = this.params.similarity
    this.column = this.params.column
  },
  mounted() {
    this.params.column.addEventListener('sortChanged', this.onSortChanged)
    this.onSortChanged()
  },
  methods: {
    ...mapActions({
      toggleSelect: 'readAcross/toggleSelectGrid',
    }),
    onMenuClicked() {
      this.params.showColumnMenu(this.$refs.menuButton)
    },
    onSortChanged() {
      // eslint-disable-next-line no-multi-assign
      this.ascSort = this.descSort = this.noSort = 'inactive'
      if (this.params.column.isSortAscending()) {
        this.ascSort = 'active'
      } else if (this.params.column.isSortDescending()) {
        this.descSort = 'active'
      } else {
        this.noSort = 'active'
      }
    },
    onSortRequested(order, ev) {
      this.params.setSort(order, ev.shiftKey)
    },
    imageUrl(chemId) {
      return this.$utility.imageUrl(chemId)
    },
    refresh(params) {
      this.isChecked = params.isChecked
      this.name = params.name
      this.targetChem = params.targetChem
      this.enableSorting = params.enableSorting
      this.chem_id = params.chem_id
      this.enableMenu = params.enableMenu
      this.similarity = params.similarity
      this.column = params.column
      return true
    },
    columnClickHandler(e) {
      if (!this.targetChem && this.chem_id !== 'ep_name') {
        if (this.currentStep < 4) {
          this.toggleSelect(this.params)
        }
        this.$nuxt.$emit('toggleSelect', this.column.colId)
      }
    },
  },
}
</script>

<style scoped>
.ag-read-across-custom-header-cell-text {
  width: auto;
  display: block;
  text-overflow: ellipsis !important;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-size: 16px;
  margin-bottom: 0.3rem;
  margin-top: 0.3rem;
}

.ag-read-across-custom-header-cell-text-sim-value {
    text-align: center;
    margin-bottom: 0.1rem;
    margin-bottom: 0.3rem;
    font-size: 16px;
}

.ag-read-across-custom-header-chem-image {
    width: 95px;
}
.ag-read-across-custom-header-cell-text-sim-value-icon-check {
  font-size: 20px;
  color: green;
}
.ag-read-across-custom-header-cell-text-sim-value-icon-x{
  font-size: 20px;
  color: red;
}
.ag-read-across-custom-header-cell-text-sim-value-icon-target {
  font-size: 20px;
  color: darkred;
}
.active {
  color: cornflowerblue;
}

</style>
