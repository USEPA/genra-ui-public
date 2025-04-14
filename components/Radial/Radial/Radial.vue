<template>
  <!-- <div class="svg-container"> -->
  <svg
    v-if="chemicals.length"
    height="80%"
    width="100%"
    class="svg-container-chemical"
    :style="`max-height: ${maxHeight}`"
    preserveAspectRatio="xMidYMid meet"
    viewBox="-45 0 625 500"
  >
    <!-- <svg v-if="chemicals.length" :width="length" :height="length"> -->
    <ChemicalSVG :chem="chemicals[0]" :size="size" :x="length / 2 - size / 2" :y="length / 2 - size / 2" />
    <g v-for="(neighbor, i) in neighbors" :key="neighbor.chem_id">
      <a v-if="neighbor.details_link" :href="neighbor.details_link" :title="neighbor.name" target="_blank">
        <ChemicalSVG
          :chem="neighbor"
          :size="size"
          :x="xPos(radius, i) - size / 2"
          :y="yPos(radius, i) - size / 2"
        />
      </a>
      <ChemicalSVG
        v-else
        :chem="neighbor"
        :size="size"
        :x="xPos(radius, i) - size / 2"
        :y="yPos(radius, i) - size / 2"
      />
      <line
        class="edge"
        :x1="xPos(70, i)"
        :y1="yPos(70, i)"
        :x2="xPos(radius - 70, i)"
        :y2="yPos(radius - 70, i)"
      />
      <circle
        class="neighborlabel"
        r="20"
        :cx="xPos(radius / 2, i)"
        :cy="yPos(radius / 2, i)"
      />
      <text
        class="neighborlabel"
        :x="xPos(radius / 2, i)"
        :y="yPos(radius / 2, i) + 4"
      >
        {{ neighbor.value.toFixed(2) }}{{ neighbor.similarity_tag ? neighbor.similarity_tag : '' }}
      </text>
    </g>
  </svg>
  <!-- </div> -->
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters,
} from 'vuex'
import ChemicalSVG from '~/components/Radial/ChemicalSVG/ChemicalSVG.vue'

export default {
  name: 'Radial',
  components: {
    ChemicalSVG,
  },
  data() {
    return {
      length: 500,
      lastRadial: 5.8,
    }
  },
  computed: {
    ...mapGetters({
      params: 'getParams',
      chemicals: 'radial/getNeighborChemicals',
    }),
    numOfAnalogues() {
      return this.params.k0
    },
    maxHeight() {
      return '550px'
    },
    neighbors() {
      return this.chemicals.slice(1)
    },
    theta() {
      return this.lastRadial / this.neighbors.length
    },
    size() {
      return (this.length / 2) / (1 / ((2 / Math.sqrt(2)) * Math.sin(this.theta / 2)) + 0.5)
    },
    radius() {
      return (this.length / 2) - (this.size / 2)
    },
  },
  methods: {
    xPos(radius, index) {
      return this.length / 2 + (radius * Math.sin(this.lastRadial * (index / (this.neighbors.length))))
    },
    yPos(radius, index) {
      return this.length / 2 - (radius * Math.cos(this.lastRadial * (index / (this.neighbors.length))))
    },
  },
}
</script>

<style>
.edge {
  stroke: black;
  stroke-width: 2px;
  transition: 1s all;
}
g:hover > .edge {
  stroke: red;
  stroke-width: 4px;
}
.neighborlabel {
  fill: white;
  stroke: red;
  opacity: 0;
}
g:hover > .neighborlabel {
  opacity: 1;
}

@media screen and (max-width: 992px) {
  g:hover > .neighborlabel {
    font-size: 12px;
  }
}
/* .svg-container {
  resize: horizontal;
  overflow: 'hidden';
  height: auto;
  width: 100%;
} */
.svg-container-chemical {
  margin-left: 0;
  /* max-height: 460px; */
}
text {
  text-anchor: middle;
  font-size: 0.75vw;
  z-index: 3;
}
</style>
