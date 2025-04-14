<template>
  <svg data-cy="ra-continuous-svg" width="100%" height="100%">
    <linearGradient id="scaleGradient">
      <stop offset="8%" :stop-color="gradientStartColor" />
      <stop offset="92%" :stop-color="gradientEndColor" />
    </linearGradient>
    <rect
      id="scaleRect"
      width="92"
      height="10"
      :x="leftRectXOffSet"
      y="9"
      fill="url(#scaleGradient)"
    />
    <!-- Estimate text -->
    <text
      v-if="showEstimate"
      :id="textId"
      :ref="textId"
      :x="calculateEstimateText"
      y="7"
      :style="`font-size: 9.5px !important`"
    >
      {{ continuousData.est_disp }}
    </text>

    <!-- Observation text -->
    <text
      v-if="showObservationText"
      :x="calculateObservationText"
      y="7"
      :style="`font-size: 9.5px !important`"
    >
      {{ continuousData.obs_disp }}
    </text>
    <!-- Observation -->
    <circle
      v-if="showObservation"
      :cx="calculateObservationScale"
      cy="14"
      r="4.5"
      fill="white"
      stroke="black"
      stroke-width="1.2"
    />
    <!-- T left of estimate -->
    <line
      v-if="showEstimate && showLeftT"
      :x1="calculateLeftTStartScale"
      y1="3"
      :x2="calculateLeftTEndScale"
      y2="3"
      stroke="black"
    />
    <line
      v-if="showEstimate && showLeftT"
      :x1="calculateLeftTEndScale"
      y1=".5"
      :x2="calculateLeftTEndScale"
      y2="5.5"
      stroke="black"
    />

    <!-- T right of estimate -->
    <line
      v-if="showEstimate && showRightT"
      :x1="calculateRightTStartScale"
      y1="3"
      :x2="calculateRightTEndScale"
      y2="3"
      stroke="black"
    />
    <line
      v-if="showEstimate && showRightT"
      :x1="calculateRightTEndScale"
      y1=".5"
      :x2="calculateRightTEndScale"
      y2="5.5"
      stroke="black"
    />

    <!-- estimate -->
    <polygon v-if="showEstimate" fill="white" stroke="black" stroke-width="1.2" :points="calculateEstimateScale" />
  </svg>
</template>

<script>
export default {
  name: 'ReadAcrossContinuousDataSVG',
  props: {
    continuousData: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      textId: '',
      estimateTextWidth: null,
      rectComputedWidth: null,
      scaleXOffSetCalculation: null,
    }
  },
  computed: {
    showObservationText() {
      return this.continuousData && this.continuousData.observation && !this.continuousData.estimate
    },
    showEstimate() {
      return this.continuousData && this.continuousData.estimate
    },
    showObservation() {
      return this.continuousData && this.continuousData.observation
    },
    gradientStartColor() {
      return this.continuousData.dir === 'RL' ? '#87070a' : '#477fb0'
    },
    gradientEndColor() {
      return this.continuousData.dir === 'RL' ? '#477fb0' : '#87070a'
    },
    showLeftT() {
      if (!this.continuousData.confMin) {
        return false
      }
      if (this.continuousData.estimate === 0 || this.calculateLeftTStartScale < Number.parseInt(this.leftRectXOffSet, 0) || this.calculateLeftTEndScale < Number.parseInt(this.leftRectXOffSet, 0)) {
        return false
      }
      return true
    },
    showRightT() {
      if (!this.continuousData.confMax) {
        return false
      }
      if ((this.continuousData.estimate === 0 && (this.continuousData.confMax <= 0))) {
        return false
      }
      return true
    },
    calculateObservationScale() {
      const observationPoint = (((this.continuousData.observation - this.continuousData.rangeMin) / (this.continuousData.rangeMax - this.continuousData.rangeMin)) * 100) + this.scaleXOffSetCalculation
      return observationPoint < Number.parseInt(this.leftRectXOffSet, 0) ? Number.parseInt(this.leftRectXOffSet, 0) : observationPoint
    },
    calculateObservationText() {
      if (!this.continuousData?.obs_disp) {
        return this.calculateObservationScale
      }
      if (this.calculateObservationScale >= 95 && this.continuousData?.obs_disp.length > 2) {
        return this.calculateObservationScale - 7
      }
      if (this.calculateObservationScale >= 8 && this.calculateObservationScale <= 9 && this.continuousData?.obs_disp.length > 2) {
        return this.calculateObservationScale + 5
      }
      return this.calculateObservationScale
    },
    calculateEstimatePoint() {
      const estimatePoint = (((this.continuousData.estimate - this.continuousData.rangeMin) / (this.continuousData.rangeMax - this.continuousData.rangeMin)) * 100) + this.scaleXOffSetCalculation
      return estimatePoint < Number.parseInt(this.leftRectXOffSet, 0) ? Number.parseInt(this.leftRectXOffSet, 0) : estimatePoint
    },
    calculateEstimateText() {
      if (!this.continuousData?.est_disp) {
        return this.calculateEstimatePoint
      }
      if (this.calculateEstimatePoint >= 95 && this.continuousData?.est_disp.length > 2) {
        return this.calculateEstimatePoint - 7
      }
      if (this.calculateEstimatePoint >= 8 && this.calculateEstimatePoint <= 8.5 && this.continuousData?.est_disp.length > 2) {
        // console.log('got here', this.continuousData)
        return this.calculateEstimatePoint + 5
      }
      return this.calculateEstimatePoint
    },
    calculateEstimateScale() {
      const centerTriangleXpoint = this.calculateEstimatePoint
      const leftTriangleXpoint = centerTriangleXpoint - 5
      const rightTriangleXpoint = centerTriangleXpoint + 5
      return `${centerTriangleXpoint} 10.5, ${leftTriangleXpoint} 18.5, ${rightTriangleXpoint} 18.5`
    },
    calculateLeftTStartScale() {
      const leftTStart = this.calculateEstimatePoint - (this.estimateTextWidth / 2)
      return leftTStart
    },
    calculateLeftTEndScale() {
      const calcLeftT = (((this.continuousData.confMin - this.continuousData.rangeMin) /
      (this.continuousData.rangeMax - this.continuousData.rangeMin)) * 100) - (this.estimateTextWidth / 2) + this.scaleXOffSetCalculation
      return calcLeftT
    },
    calculateRightTStartScale() {
      const rightTStart = this.calculateEstimatePoint + (this.estimateTextWidth / 2)
      return rightTStart
    },
    calculateRightTEndScale() {
      const calcRightT = ((((this.continuousData.confMax - this.continuousData.rangeMin) / (this.continuousData.rangeMax - this.continuousData.rangeMin)) * 100) +
      (this.estimateTextWidth / 2)) + this.scaleXOffSetCalculation
      return calcRightT > 105 ? 105 : calcRightT
    },
    leftRectXOffSet() {
      return '8'
    },
  },
  watch: {
    rectComputedWidth(val, oldVal) {
      const leftXOffset = Number.parseFloat(this.leftRectXOffSet, 0)
      this.scaleXOffSetCalculation = leftXOffset - val
    },
  },
  beforeMount() {
    this.textId = this.continuousData.cellId
  },
  mounted() {
    // eslint-disable-next-line no-return-assign
    setTimeout(() => {
      const textEle = document.getElementById(`${this.textId}`)
      if (textEle) {
        this.estimateTextWidth = textEle.getComputedTextLength()
      }
    }, 0)
    // eslint-disable-next-line no-return-assign
    setTimeout(() => {
      const rectEle = document.getElementById('scaleRect')
      if (rectEle) {
        this.rectComputedWidth = Number.parseFloat(100 - rectEle.getBoundingClientRect().width
          , 0)
      }
    }, 0)
  },
  methods: {
  },
}
</script>

<style scoped>

</style>
