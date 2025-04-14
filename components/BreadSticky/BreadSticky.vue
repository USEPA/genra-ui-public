<template>
  <div>
    <div data-cy="progessTracker" class="breadsticky">
      <div class="crumbs">
        <div
          v-for="(step, idx) in stepDesc"
          :key="idx"
          :title="stepDesc[idx]"
          class="genra-breadcrumb"
          :class="{active: currentStep >= idx}"
          @click="handleTrackerClick(idx)"
        />
      </div>
      <div class="step-desc">
        {{ stepDesc[currentStep] }}
      </div>
      <a v-if="currentStep >= 1" class="target-chem-info" @click="showTargetChemical()">
        <b-icon-info-circle-fill />
        <u>Target Chemical
        </u>
      </a>
    </div>
    <TargetChemicalModal ref="target-chemical-modal" :current-chemical="currentChemical" />
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'
import TargetChemicalModal from './TargetChemicalModal.vue'

export default {
  name: 'Breadsticks',
  components: {
    TargetChemicalModal,
  },
  computed: {
    ...mapGetters({
      runReadAcrossLoading: 'readAcross/getRunReadAcrossLoading',
      assayDataLoading: 'assay/getAssayDataLoading',
      radialRefresh: 'radial/getRadialPanelRefresh',
      currentStep: 'getStep',
      stepDesc: 'getStepDesc',
      currentChemical: 'chemical/getChemical',
    }),
    finalStep() {
      return this.stepDesc.length
    },
  },
  methods: {
    handleTrackerClick(clickedStep) {
      if (!this.runReadAcrossLoading) {
        this.$store.dispatch('setStep', (Math.min(this.currentStep, clickedStep)))
        if (clickedStep === 0) {
          this.$nuxt.$emit('clear', null)
        }
      }
    },
    showTargetChemical() {
      if (!this.radialRefresh) {
        const targetChemicalModal = this.$refs['target-chemical-modal']
        if (targetChemicalModal) {
          targetChemicalModal.show = true
        }
      }
    },
  },
}
</script>

<style scoped>
.breadsticky {
  height: 100px;
  background: #0e6993;
  z-index: 5;
  width: 100%;
  margin: 10px auto;
  border: 1px solid black;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  --inactive: #eee;
  --active: #ffb800;
}
.target-chem-info {
  text-align: center;
  color: var(--inactive);

}
.target-chem-info:hover {
  cursor: pointer;
}

.crumbs {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.genra-breadcrumb {
  background-color: var(--inactive);
  width: 27em;
  height: 30px;
  margin: 10px 2em;
  position: relative;
  transition: filter 1s, background-color 1s;
}
.genra-breadcrumb:before {
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid var(--inactive);
  border-left: 20px solid transparent;
  border-right: 20px solid var(--inactive);
  border-bottom: 15px solid var(--inactive);
  position: absolute;
  left: -20px;
  top: 0;
  transition: filter 1s, border-color 1s;
}
.genra-breadcrumb:after {
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-left: 20px solid var(--inactive);
  border-bottom: 15px solid transparent;
  position: absolute;
  right: -20px;
  top: 0;
  transition: filter 1s, border-color 1s;
}
.genra-breadcrumb.active {
  background-color: var(--active);
  filter: drop-shadow(6px 6px 3px #003350);
}
.genra-breadcrumb.active:before {
  border-top-color: var(--active);
  border-right-color: var(--active);
  border-bottom-color: var(--active);
}
.genra-breadcrumb.active:after {
  border-left-color: var(--active);
}
.genra-breadcrumb:hover {
    cursor: pointer;
}
.progress-buttons {
  color: white;
}
.step-desc {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--inactive);
  text-align: center;
}

</style>
