<template>
  <div
    v-if="display"
    class="fpcell"
    :class="{high: scaled > 0.4}"
    :style="{backgroundColor: getColor(scaled)}"
  >
    {{ display }}
  </div>
</template>

<script>

export default {
  name: 'HeatColoredNumber',
  computed: {
    display() {
      let r = 'N/A'
      r = `${this.params.value.toString()}`
      return r
    },
    scaled() {
      const column = this.params.column.colId
      const scaled = this.params.data[column]
      return scaled.scaled
    },
    colormaps() {
      return this.$utility.colormaps.inferno
    },
  },
  methods: {
    getColor(value) {
      let retColor = ''
      retColor = this.colormaps[parseInt(72 * (1 - value), 10)]
      return retColor
    },
  },
}
</script>

<style lang="scss" scoped>
.ag-theme-balham .ag-ltr .ag-cell {
    padding-left: 3px !important;
    padding-right: 3px !important;
}
.fpcell {
  height: 100% !important;
  font-size: 12px;
}
.high {
  color: white;
}
</style>
