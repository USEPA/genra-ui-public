<template>
  <div class="chart-headers thead">
    <div class="assay-label" />
    <div class="target chem-label">
      {{ target.value.toFixed(2) }}
      <span class="select-mark" title="target">&#8858;</span>
      <img
        class="chem-image"
        :src="imageUrl(target.chem_id)"
      >
      <br>
      <div class="chem-name">
        {{ target.name }}
      </div>
    </div>
    <div v-for="chemical in neighbors" :key="chemical.chem_id" class="chem-label" @click="toggleSelect(chemical)">
      <div>
        <div class="target-two chem-label">
          {{ chemical.value.toFixed(2) }}
          <span class="select-mark" :title="chemical.selected ? 'selected' : 'hidden'" :class="{selected: chemical.selected}">
            {{ chemical.selected ? '&#10004;' : '&#10008;' }}
          </span>
          <img class="chem-image" :src="imageUrl(chemical.chem_id)">
          <br>
          <div class="chem-name">
            {{ chemical.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'ReadAcrossChartHeaders',
  computed: {
    ...mapGetters({
      readAcrossChemicals: 'readAcross/getReadAcrossChemicals',
    }),
    target() {
      return this.readAcrossChemicals[0]
    },
    neighbors() {
      return this.readAcrossChemicals.slice(1)
    },
  },
  methods: {
    ...mapActions({
      toggleSelect: 'readAcross/toggleSelect',
    }),
    imageUrl(chemId) {
      return this.$utility.imageUrl(chemId)
    },
  },
}
</script>

<style scoped>
.assay-label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 12vw;
  text-align: right;
  line-height: 3.5vh;
  height: 3.5vh;
}
.chart-headers {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background: white;
  display: flex;
  flex-flow: row nowrap;
  opacity: 0.999;
  z-index: 5;
}
.chem-image {
  width: 4vw;
}
.chem-label {
  width: 5vw;
  cursor: pointer;
}
.chem-label.target {
  cursor: default;
  font-size: 1.0vw;
  text-align: center;
}
.chem-label.target-two {
  cursor: default;
  font-size: 1.0vw;
  text-align: center;
  cursor: pointer;
}
.chem-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.7vw;
  padding-left: 10px;
  width: 100%;
}
.select-mark {
  color: darkred;
  font-size: 1.2vw;
}
.inactive {
  opacity: 0.3;
  z-index: -1;
}
.target, .target.cell {
  margin-left: 1em;
  margin-right: 1em;
  border-right: 1px dotted #ccc;
  border-left: 1px dotted #ccc;
}
@media screen and (max-width: 991px) {
  .chem-name {
    font-size: 0.9vw;
  }
  .chem-label.target-two {
    font-size: 0.8vw;
    padding-left: 5px;
  }
  .chem-label.target {
    font-size: 0.8vw;
    padding-left: 2px;
  }

}
</style>
