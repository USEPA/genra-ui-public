<template>
  <ReadAcrossContinuousDataSVG
    :continuous-data="continuousData"
  />
</template>

<script>
import Vue from 'vue'
import ReadAcrossContinuousDataSVG from './ReadAcrossContinuousDataSVG.vue'

export default Vue.extend({
  name: 'ContinuousPredObs',
  components: {
    ReadAcrossContinuousDataSVG,
  },
  computed: {
    continuousData() {
      const {
        isChecked, isPrediction, pval, similarity, value, ...continData
      } = this.params.data[this.params.colDef.field]
      return {
        ...continData,
        cellId: `${this.params.data.ep_name}${this.params.colDef.field}`,
      }
    },
  },

})
</script>

<style>

</style>
