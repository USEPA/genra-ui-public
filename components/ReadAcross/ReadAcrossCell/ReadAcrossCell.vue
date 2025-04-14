<template>
  <div class="cell" :style="{opacity: opacity}" :title="tooltip">
    <div :style="{backgroundColor: color, width: width}" />
  </div>
</template>

<script>
export default {
  name: 'ReadAcrossCell',
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    predicted: {
      type: Boolean,
      default: false,
    },
    predict: {
      required: true,
      validator(prop) { return typeof prop === 'object' || typeof props === 'undefined' },
    },
    width: {
      type: [Number, String],
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    opacity() {
      if (this.predicted && this.predict) {
        return this.predict.pval * 0.6 + 0.1
      }
      return this.active ? 1 : 0.3
    },
    color() {
      if (this.predicted && this.predict && this.predict.value) {
        return 'darkred'
      } if (this.predicted && this.predict) {
        return 'steelblue'
      } if (this.value === 'no_data') {
        return 'lightgrey'
      } if (this.value === 'no_effect') {
        return 'steelblue'
      }
      return 'darkred'
    },
    tooltip() {
      if (this.predicted && this.predict) {
        return `${this.predict.text}; Act=${this.predict.act}; AUC=${this.predict.auc}; pval=${this.predict.pval}`
      }
      return this.value
    },
  },
}
</script>

<style scoped>
.cell {
  width: 5vw;
  height: 100%;
  margin: 0;
  border-top: 1px dotted #ccc;
  padding: 1px;
}
div.cell > div {
  height: 100%;
  transition: width 1.0s;
}
</style>
