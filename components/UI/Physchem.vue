<template>
  <modal
    name="physchem"
    draggable=".physchem-container"
    data-cy="physchem-plot-modal"
    :height="600"
    :width="600"
    :reset="true"
    :resizable="true"
    :adaptive="false"
    :scrollable="false"
  >
    <div class="physchem-container p-1">
      <div class="physchem-header text-white py-1 px-3">
        <div class="row">
          <div class="col-11">
            PhysChem Data
          </div>
          <div class="col-1 closer" @click="closeModal()">
            X
          </div>
        </div>
      </div>
      <iframe
        v-if="radialParams"
        :srcdoc="plotUrl"
      />
    </div>
  </modal>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'

export default {
  name: 'PhyschemModal',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      radialParams: 'radial/getLastWorkingRadialParams',
      currentStep: 'getStep',
      plotUrl: 'radial/getPhyschemPlotUrl',
    }),
  },
  methods: {
    closeModal() {
      this.$nuxt.$emit('resetShowModal', true)
      this.$modal.hide('physchem')
    },
  },
}
</script>
<style lang="scss">
.closer {
  background-color: #0e6993;
  cursor: default;
}
.physchem-header {
  background-color: #0e6993;
  cursor: -webkit-grab;
  cursor: grab;
}
.physchem-header:active {
  background-color: #0e6993;
  cursor: move;
}
.physchem-container {
  height:100%;
}
.vm--overlay {
  display: none !important;
  width:5px !important;
  height:5px !important;
}
.vm--container {
  width:5px !important;
  height:5px !important;
}
iframe {
  vertical-align: top;
  width: 100%;
  height: 93%;
  border: 0;
  margin-bottom: 10px;
}
</style>
