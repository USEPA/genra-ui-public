<template>
  <b-popover
    :show.sync="showPopover"
    data-cy="hybrid-fp-popover"
    target="multiple-popover-target"
    :title="`Hybrid FP (max ${maxHybridFps})`"
  >
    <transition-group name="fade">
      <div v-for="(selection) in fpSelections" :key="`${selection.value}0`">
        <div :key="`${selection.value}1`" class="select-container">
          <b-icon
            v-if="selection.value !== null"
            :key="`${selection.value}2`"
            class="remove-icon"
            title="Remove"
            icon="x-circle-fill"
            variant="danger"
            @click="removeFpSelectionHandler(selection.value)"
          />
          <b-form-select
            :key="selection.value === null ? `${selection.value}3` : `${selection.value}33`"
            :ref="selection.value === null ? `${selection.value}3` : `${selection.value}33`"
            :value="selectedFp(selection.value)"
            :options="fpOptions"
            size="sm"
            class="mb-3"
            @change="selectHandler($event, selection.value)"
          />
        </div>
        <div v-if="selection.value !== null" :key="`${selection.value}4`" style="text-align: center;justify-content: center;">
          <b-form-input
            id="range-1"
            :key="`${selection.value}5`"
            :value="selection.rangeValue"
            type="range"
            min="1"
            max="12"
            @input="rangeChangeHandler({selectedFp: $event, prevFp: selection.value})"
          />
          <span :key="`${selection.value}6`">Weight: {{ selection.rangeValue }}</span><br>
        </div>
        <hr :key="selection.value">
      </div>
    </transition-group>
    <b-list-group v-for="fp in fpSelectionArr" :key="fp.value + fp.rangeValue" flush class="mb-1">
      <b-list-group-item class="fp-weight-percentage">
        {{ getFpWeight(fp.value) }}%
      </b-list-group-item>
    </b-list-group>
    <div class="mt-2">
      <div style="float: right; margin-bottom: 10px">
        <b-button type="submit" data-cy="close-hybrid-fp-popover" size="sm" @click="showPopover = false">
          Close
        </b-button>
        <b-button type="reset" variant="primary" :disabled="!fpSelectionArr.length" size="sm" @click="submitHandler">
          Submit
        </b-button>
      </div>
    </div>
  </b-popover>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapMutations, mapActions,
} from 'vuex'

export default {
  name: 'RadialFpPopover',
  data() {
    return {
      selected: null,
    }
  },
  computed: {
    ...mapGetters({
      showMultipleFpPopover: 'radial/getShowMultipleFpPopover',
      fpSelectionArr: 'radial/getMultipleFpSelections',
      fingerprints: 'radial/getValidFpArr',
      maxHybridFps: 'radial/getMaxHybridFp',
      params: 'getParams',
    }),
    fpSelections() {
      return this.fpSelectionArr.length >= this.maxHybridFps ? this.fpSelectionArr : this.fpSelectionArr.concat([{value: null}])
    },
    fpOptions() {
      const fpOpts = [{value: null, text: 'Please select an option'}]
      const fps = this.fingerprints.filter(fprint => fprint.key !== 'hybrid' && fprint.key !== 'edit_hybrid')
      return this.fpSelectionArr.length >= this.maxHybridFps ? this.$utility.translateSelectOptions(fps) : fpOpts.concat(this.$utility.translateSelectOptions(fps))
    },
    showPopover: {
      get() {
        return this.showMultipleFpPopover
      },
      set(val) {
        if (!val) {
          this.$emit('reset-neighbor-by', Object.prototype.hasOwnProperty.call(this.params, 'fp_weight'))
        }
        this.showFpPopover(val)
      },
    },
  },
  methods: {
    ...mapMutations({
      showFpPopover: 'radial/setShowMultipleFpPopover',
      modifySelectedFps: 'radial/setMultipleFpSelections',
      setFingerprints: 'radial/setValidFpArr',
    }),
    ...mapActions({
      selectFpHandler: 'radial/hybridFpAddHandler',
      removeFpSelectionHandler: 'radial/hybridFpRemoveHandler',
      rangeChangeHandler: 'radial/hybridFpRangeHandler',
      submitHandler: 'radial/hybridFpSubmitHandler',
    }),
    selectHandler(e, fpVal) {
      this.selectFpHandler({
        prevFp: e,
        selectedFp: fpVal,
      })
      if (this.$refs.null3) {
        this.$refs.null3[0].localValue = null
      }
    },
    selectedFp(fp) {
      return this.fpSelectionArr.some(fprint => fprint.value === fp) ? this.fpSelectionArr.find(sel => sel.value === fp).value : null
    },
    getFpWeight(fp) {
      const totalSum = this.fpSelectionArr.reduce((acc, cv) => acc + Number.parseInt(cv.rangeValue, 10), 0)
      const findFp = this.fpSelectionArr.find(fingerprint => fingerprint.value === fp)
      const fpName = this.fingerprints.find(fprint => fprint.key === fp).name
      return `${fpName}: ${Math.round((findFp.rangeValue / totalSum) * 100)}`
    },
  },
}
</script>

<style scoped>
.select-container {
    display: flex;
}
.remove-icon {
    margin-top: 8px;
    margin-right: 5px;
}
.remove-icon:hover {
    cursor: pointer;
}
.fp-weight-percentage {
    padding: 0
}
.remove-icon:hover {
    cursor: pointer;
}
.fade-enter-active {
    transition: opacity .7s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
}
.fade-move {
    transition: transform 1s;
}

</style>
