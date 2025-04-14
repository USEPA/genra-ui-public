<template>
  <div style="height: 100%">
    <!-- Colored Cells -->
    <div class="cell" :style="{opacity: opacity}">
      <div v-if="params.value.useWidth" :style="{backgroundColor: color, width: width}" />
      <div v-else :style="{backgroundColor: color, width: width}" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
/* eslint-disable object-shorthand */

export default Vue.extend({
  name: 'RedBlueTooltip',
  components: {
  },
  computed: {
    opacity() {
      if (this.params.value.value && this.params.value.isPrediction && (this.params.data[this.params.colDef.field].isChecked || this.params.colDef.headerComponentParams.targetChem)) {
        if (this.params.value.pval) {
          const opac = this.params.value?.pval * 0.6 + 0.1
          return opac
        }
      }
      return (this.params.data[this.params.colDef.field].isChecked || this.params.colDef.headerComponentParams.targetChem) ? 1 : 0.4
    },
    color() {
      if ((!Number.isNaN(this.params.value.value) && !this.params.value.value === 'no_data' && !this.params.value.value === 'no_effect') && this.params.value.isPrediction) {
        return 'darkred'
      } if ((Number.isNaN(this.params.value.value) && this.params.value.value === 'no_effect') && this.params.value.isPrediction) {
        return 'steelblue'
      } if (this.params.value.value === 'no_data') {
        return 'lightgrey'
      } if (this.params.value.value === 'no_effect') {
        return 'steelblue'
      }
      return 'darkred'
    },
    width() {
      if (this.params?.value.useWidth) {
        const simWidth = `${this.params.value.similarity * 100}%`
        return simWidth
      }
      return '100%'
    },
    continuousData() {
      const {
        isChecked, isPrediction, pval, similarity, value, ...continData
      } = this.params.data[this.params.colDef.field]
      return {
        ...continData,
        cellId: `${this.params.data.ep_name}${this.params.colDef.field}`,
      }
    },
    isContinuousDataCell() {
      return Object.keys(this.params.data[this.params.colDef.field]).includes('rangeMin')
    },
  },
  methods: {
    refresh(params) {
      return true
    },
  },
})
</script>

<style scoped>
.cell {
  width: 110px;
  max-width: 110px;
  height:100%;
  margin: 0;
  border-top: 1px solid white;
  padding: 0px;
}
div.cell > div {
  height: 100%;
  transition: width 1.0s;
}
</style>
