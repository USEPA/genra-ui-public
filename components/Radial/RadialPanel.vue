<template>
  <div class="genrapanel radial">
    <b-modal
      id="error-modal"
      variant="danger"
      ok-only
      centered
      header-bg-variant="danger"
      header-text-variant="light"
      :visible="onChangeError"
      title="Error"
      @hide="modalCloseHandler"
    >
      <p class="my-4">
        {{ errorMsg }}
      </p>
    </b-modal>
    <b-overlay
      id="overlay-background"
      :show="radialRefresh"
      variant="transparent"
      opacity="0.65"
      blur="4px"
      rounded="sm"
    >
      <physchem v-if="physChemModal" />
      <b-navbar toggleable="sm" class="fingerprint-nav">
        <b-navbar-nav class="mr-auto">
          <b-nav-form>
            <label class="label">Neighbors by:</label>
            <b-form-select
              id="multiple-popover-target"
              ref="neighbor-by-dropdown"
              :disabled="runReadAcrossLoading || showMultipleFpPopover"
              :value="Object.prototype.hasOwnProperty.call(params, 'fp_weight') ? 'hybrid' : params.fp"
              class="neighbors-by-select"
              size="sm"
              @change="neighborFilterChangeHandler($event, 'neighbor_by')"
            >
              <template #default>
                <b-form-select-option
                  v-for="option in fingerprintOptions"
                  :key="option.value"
                  v-b-tooltip
                  :title="option.description"
                  :data-cy="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.text }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-nav-form>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <label class="label">Filter by:</label>
            <b-form-select
              :disabled="runReadAcrossLoading"
              :value="params.sel_by"
              class="neighbors-by-select"
              size="sm"
              @change="neighborFilterChangeHandler($event, 'filter_by')"
            >
              <template #default>
                <b-form-select-option
                  v-for="option in filterByOptions"
                  :key="option.value"
                  v-b-tooltip
                  :title="option.description"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.text }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-nav-form>
          <b-navbar-nav class="ml-auto">
            <b-dropdown size="sm" class="radial-dropdown-download">
              <template #button-content>
                <b-icon-download />
              </template>
              <b-dropdown-item
                v-for="option in downloadOptions"
                :key="option.subdir"
                :disabled="!option.data_exists"
                :title="option.hoverText"
                :data-cy="option.subdir.substring(1)"
                @click="dropdownDownloadHandler(option.subdir)"
              >
                {{ option.title }}
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <Help class="radial-help-icon ml-3" help-key="GENRA Analog Identification" />
          </b-navbar-nav>
        </b-navbar-nav>
      </b-navbar>
      <Radial />
      <div v-if="!radialError" class="bottom-inputs">
        <div class="analog-input-group ml-2">
          <b-input-group prepend="# of Analogs" size="sm" class="analog-input-label">
            <b-form-input
              id="analog-input"
              :disabled="runReadAcrossLoading || radialRefresh"
              :value="analogs"
              data-cy="analog-identifier"
              size="sm"
              min="1"
              max="15"
              type="number"
              @change="analogChangeHandler"
            />
          </b-input-group>
        </div>
        <b-button
          v-if="currentStep >= 1"
          id="physchem-button"
          size="sm"
          data-cy="physchem-button"
          variant="primary"
          :title="physchemTitle"
          class="next-button mr-2"
          :disabled="!plotUrl"
          @click="showPhyschem"
        >
          Physchem Data
        </b-button>
        <b-button
          v-if="currentStep >= 1"
          id="neighborhood-button"
          size="sm"
          data-cy="ne-explorer-button"
          variant="primary"
          :title="neighborhoodTitle"
          class="next-button mr-2"
          :disabled="disableGraphModal"
          @click="showNeighborhoodExploration(true)"
        >
          Neighborhood Exploration
        </b-button>
        <b-button
          v-if="currentStep <= 1"
          id="nextButton"
          size="sm"
          data-cy="radial-next-button"
          :variant="fingerprintDataErr || assayDataPanelError ? 'warning' : 'primary'"
          :class="fingerprintDataErr || assayDataPanelError ? '' : 'next-button mr-2'"
          :disabled="fingerprintRefresh || fingerprintDataErr || assayDataLoading || assayDataPanelError"
          @click="handleNext"
        >
          <template v-if="fingerprintRefresh || assayDataLoading">
            <b-spinner small type="grow" />
            <span>Loading</span>
          </template>
          <template v-else>
            {{ fingerprintDataErr || assayDataPanelError ? 'Error Retrieving Summary - Please adjust filters.' : 'Next' }}
          </template>
        </b-button>
        <b-button
          v-else
          id="hideButton"
          size="sm"
        >
          <template>
            hidden
          </template>
        </b-button>
      </div>
      <RadialFpPopover v-if="showMultipleFpPopover" @reset-neighbor-by="resetNeighborSelection" />
      <RadialNeighborhoodModal
        v-if="showNeModal"
        ref="neighborhoodModal"
        :show-ne-modal="showNeModal"
        @showNeighborhoodExploration="showNeighborhoodExploration"
      />
    </b-overlay>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapActions, mapMutations,
} from 'vuex'
import debounce from 'debounce'
import Radial from '~/components/Radial/Radial/Radial.vue'
import Physchem from '~/components/UI/Physchem.vue'
import Help from '~/components/Helpers/Help.vue'
// import RadialFpPopover from '~/components/Radial/RadialFpPopover/RadialFpPopover.vue'
import RadialFpPopover from '~/components/Radial/RadialFpPopover/RadialFpPopover.vue'
import RadialNeighborhoodModal from './RadialNeighborhoods/RadialNeighborhoodModal.vue'

export default {
  name: 'RadialPanel',
  components: {
    Radial,
    Help,
    RadialFpPopover,
    Physchem,
    RadialNeighborhoodModal,
  },
  data() {
    return {
      onChangeError: false,
      errorMsg: '',
      physChemModal: false,
      showNeModal: false,
    }
  },
  computed: {
    ...mapGetters({
      params: 'getParams',
      showMultipleFpPopover: 'radial/getShowMultipleFpPopover',
      chemicals: 'radial/getNeighborChemicals',
      assayDataLoading: 'assay/getAssayDataLoading',
      downloadArr: 'setup/getDownloadArray',
      assayDataPanelError: 'assay/getAssayDataPanelError',
      radialLoading: 'radial/getRadialPanelLoading',
      radialRefresh: 'radial/getRadialPanelRefresh',
      radialError: 'radial/getRadialPanelError',
      fingerprintRefresh: 'fingerprint/getFingerprintRefreshLoading',
      fingerprintDataErr: 'fingerprint/getFingerprintHeatPanelError',
      runReadAcrossLoading: 'readAcross/getRunReadAcrossLoading',
      currentStep: 'getStep',
      fingerprints: 'setup/getValidFpArray',
      filterBy: 'setup/getValidFilterArray',
      graphData: 'radial/getNeighborhoodGraphData',
      graphFps: 'radial/getGraphFps',
      plotUrl: 'radial/getPhyschemPlotUrl',
    }),
    analogs() {
      return this.params.k0
    },
    downloadOptions() {
      return this.downloadArr.filter(download => download.rel).filter(download => download.rel.includes('radial')).map(filteredDownload => ({
        ...filteredDownload, title: filteredDownload.name, hoverText: filteredDownload.description,
      }))
    },
    disableGraphModal() {
      return !(Object.keys(this.graphData).includes('edges') && Object.keys(this.graphData).includes('nodes') && this.graphData.edges.length > 0 && Object.keys(this.graphData.nodes).length > 0)
    },
    neighborhoodTitle() {
      if (this.disableGraphModal) {
        return 'Neighboorhood Exploration unavailable with current combinations of fingerprints/filters.'
      }
      return 'Click to view the Neighboorhood Exploration Graph.'
    },
    physchemTitle() {
      if (!this.plotUrl) {
        return 'Physchem plot unavailable with current combinations of fingerprints/filters.'
      }
      return 'Click to view Phsychem plot.'
    },
    fingerprintOptions() {
      const fpOptions = this.$utility.translateSelectOptions(this.fingerprints)
      if (Object.prototype.hasOwnProperty.call(this.params, 'fp_weight') && this.$refs['neighbor-by-dropdown'].localValue === 'hybrid') {
        fpOptions.push({
          text: 'Edit Custom Hybrid',
          value: 'edit_hyrbid',
        })
      }
      return fpOptions
    },
    filterByOptions() {
      return this.$utility.translateSelectOptions(this.filterBy)
    },
  },
  created() {
    this.$nuxt.$on('resetShowModal', () => {
      this.physChemModal = false
    })
    this.$nuxt.$on('hideNeighborhoodGraphModal', () => {
      this.$refs.neighborhoodModal.$modal.hide('neighborHoodGraphModal')
    })
  },
  methods: {
    ...mapActions({
      inputChangeHandler: 'radial/inputChangeHandler',
      resetHybridFp: 'radial/hybridFpReset',
      downloadRadial: 'radial/downloadRadial',
    }),
    ...mapMutations({
      showFpPopover: 'radial/setShowMultipleFpPopover',
      resetModifiedFps: 'radial/setModifiedGraphFps',
    }),
    dropdownDownloadHandler(subdir) {
      this.downloadRadial(subdir)
    },
    showNeighborhoodExploration(show) {
      this.resetModifiedFps(this.graphFps)
      this.showNeModal = show
    },
    showPhyschem() {
      this.physChemModal = true
      this.$nextTick(() => {
        this.$modal.show('physchem')
      })
    },
    resetNeighborSelection(resetHybrid) {
      this.$refs['neighbor-by-dropdown'].localValue = resetHybrid ? 'hybrid' : this.params.fp
      if (!resetHybrid) {
        this.resetHybridFp()
      }
    },
    // eslint-disable-next-line func-names
    analogChangeHandler: debounce(function(ev) {
      const number = parseInt(ev, 10)
      const isErr = !!((Number.isNaN(number) || (number < 1 || number > 15)))
      if (isErr) {
        this.errorMsg = '# of Analogs must be a number between 1 and 15.'
        this.onChangeError = true
        return false
      }
      this.$store.commit('radial/setRadialPanelRefresh', true)
      this.$store.dispatch('setParams', {...this.$store.getters.getParams, k0: number})
      this.$store.dispatch('getGenraData')
      this.$nuxt.$emit('refreshRadialData')
      if (this.currentStep > 3) {
        this.$store.dispatch('setStep', 3)
      }
      return true
    }, 400),
    // eslint-disable-next-line prefer-arrow-callback
    // eslint-disable-next-line func-names
    neighborFilterChangeHandler: debounce(function(ev, inputOption) {
      if (inputOption === 'neighbor_by' && (ev === 'hybrid' || ev === 'edit_hyrbid')) {
        this.showFpPopover(true)
        this.$refs['neighbor-by-dropdown'].localValue = 'hybrid'
        return
      }
      this.inputChangeHandler({ev, inputOption})
    }, 400),
    handleNext() {
      this.$store.dispatch('setStep', this.$store.getters.getStep + 1)
    },
    modalCloseHandler() {
      document.getElementById('analog-input').value = this.analogs
      this.onChangeError = !this.onChangeError
    },
  },
}
</script>

<style scoped>
#overlay-background {
  height: 100%
}
#analog-input {
  height: 35px;
  width: 55px;
}
#hideButton {
  visibility: hidden;
}
.analog-input-group {
  max-height: 40px;
}
.bottom-inputs {
  display: inline-flex;
  flex-flow: row;
  white-space: nowrap !important;
  justify-content: space-evenly;
  position: relative;
  bottom: 0;
  width: 100%;
  height: auto;
}
@media screen and (max-width: 992px) {
  .next-button {
    font-size: 1.2vw !important
  }
  .next-button-err {
    font-size: 1.2vw !important
  }
}

@media screen and (max-width: 1670px) {
  .input-group-text {
    display: none;
  }
}
.fingerprint-nav {
  background-color: #e8f6fd!important;
  border-bottom: 1px solid #ddd;
  height: 3.5em;
}
.genrapanel {
   border: 1px solid #ddd;
   position: relative;
   z-index : 999;
}
.label {
  font-weight: 700;
  font-size: 14px;
}
.next-button {
  font-size: 0.8vw;
  background-color: #0e6993;
  max-height: 50px;
}
.next-button-err {
  font-size: 0.8vw;
  background-color: #0e6993;
}
.next-button:hover {
  background-color: #095273;
}
.neighbors-by-select {
  width: 90%;
}
.radial-dropdown-download {
  margin-top: 15px;
  line-height: 1.5;
}
:deep(.dropdown-toggle) {
  background-color: #0e6993;
}
.radial-help-icon :deep(svg) {
  vertical-align: -1.01em !important;
}
</style>
