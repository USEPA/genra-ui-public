<template>
  <div style="height: 100%; width: 110px">
    <div
      v-if="params.value.useWidth"
      :style="`backgroundColor: ${params.value.color}; height: 100%; width: ${width}; opacity: ${opacity}`"
    />
    <div v-else :style="`backgroundColor: ${params.value.color}; height: 100%; width: ${width}; opacity: ${opacity}`" />
  </div>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  name: 'MultiCategory',
  computed: {
    width() {
      if (this.params?.value.useWidth) {
        const simWidth = `${this.params.value.similarity * 100}%`
        return simWidth
      }
      return '100%'
    },
    opacity() {
      return this.params.data[this.params.colDef.field].isChecked ? 1 : 0.4
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
.ag-cell-value {
    width: 100%;
}

</style>
