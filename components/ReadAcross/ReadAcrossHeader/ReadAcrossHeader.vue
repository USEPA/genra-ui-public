<template>
  <b-navbar toggleable="sm" class="read-across-nav">
    <b-navbar-nav class="mr-auto">
      <b-button
        class="read-across-button ml-2"
        data-cy="run-read-across"
        :disabled="isRraDisabled"
        :title="rraTitle"
        @click="runReadAcross"
      >
        <template v-if="runReadAcrossLoading">
          <b-spinner small type="grow" />
          Running...
        </template>
        <template v-else>
          Run Read-Across
        </template>
      </b-button>
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <b-nav-form>
        <b-form-select v-model="currentPredEngine" size="sm">
          <template v-if="!currentPredEngine" #first>
            <b-form-select-option title="No prediction engine available for this combination of inputs" :value="null" disabled>
              N/A
            </b-form-select-option>
          </template>
          <template #default>
            <b-form-select-option
              v-for="option in predEngineTypes"
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
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <b-nav-form>
        <label class="label">Sort:</label>
        <b-form-select v-model="currentSortOption" data-cy="ra-sort-dropdown" class="dropdown-select" size="sm">
          <template #default>
            <b-form-select-option
              v-for="option in sortByOptions"
              :key="option.value"
              v-b-tooltip
              :title="option.description"
              :data-cy="option.text"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.text }}
            </b-form-select-option>
          </template>
        </b-form-select>
        <b-button
          size="sm"
          variant="primary"
          data-cy="sort-icon-button"
          :title="`Click to toggle between ascending and descending ${sortByOptions.find(option => option.value === currentSortOption)?.text}`"
          class="sort-helper-button ml-2"
          @click="sortHandler"
        >
          <b-icon data-cy="ra-sort-icon" :icon="currentSortIcon" />
        </b-button>
      </b-nav-form>
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <b-nav-form>
        <label class="label">Min+</label>
        <b-form-select v-model="minPlus" data-cy="ra-min-plus-dropdown" :options="min" size="sm" />
      </b-nav-form>
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <b-nav-form>
        <label class="label">Min-</label>
        <b-form-select v-model="minMinus" data-cy="ra-min-minus-dropdown" :options="min" size="sm" />
      </b-nav-form>
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <b-nav-form>
        <label class="label">Similarity Weight:</label>
        <b-form-checkbox
          v-model="checkBox"
          unchecked-value="false"
          class="mt-1"
          size="sm"
          data-cy="read-across-sim"
          @change="checkboxHandler"
        />
      </b-nav-form>
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <b-form-checkbox
        v-model="paginate"
        data-cy="read-across-pagination"
        switch
        class="mr-4 mt-3 mb-2"
        aria-label="Control Pagination"
      >
        <label class="label">{{ showPagination ? 'Hide Pagination' : 'Show Pagination' }}</label>
      </b-form-checkbox>
    </b-navbar-nav>
    <b-navbar-nav data-cy="ra-download-select-container" class="mr-auto">
      <b-nav-form>
        <label class="label">Download:</label>
        <b-form-select v-model="download" class="dropdown-select" data-cy="ra-download-dropdown-select" size="sm" :disabled="disableDownload">
          <template #default>
            <b-form-select-option
              v-for="option in downloadTypes"
              :key="option.value"
              v-b-tooltip
              :title="option.description"
              :data-cy="option.value?.substring(1) || undefined"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.text }}
            </b-form-select-option>
          </template>
        </b-form-select>
      </b-nav-form>
    </b-navbar-nav>
    <b-navbar-nav class="mr-auto">
      <Help class="ra-help-icon" help-key="GENRA Run GenRA Prediction" size="rra" />
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import {
  mapGetters, mapMutations, mapActions,
} from 'vuex'
import Help from '~/components/Helpers/Help.vue'

export default {
  name: 'ReadAcrossHeader',
  components: {
    Help,
  },
  data() {
    return {
      minMinus: this.$store.state.params.neg0,
      minPlus: this.$store.state.params.pos0,
      prevMin: this.$store.state.params.neg0,
      prevPlus: this.$store.state.params.pos0,
      minMinusFromEvent: false,
      minPlusFromEvent: false,
      currentSortOption: '',
      currentSortOrder: 'asc',
      checkBox: false,
    }
  },
  computed: {
    ...mapGetters({
      genra: 'readAcross/getGenra',
      min: 'readAcross/getMin',
      filter: 'readAcross/getFilter',
      downloadValue: 'readAcross/getDownloadValue',
      similarityWidth: 'readAcross/getSimilarityWidth',
      runReadAcrossLoading: 'readAcross/getRunReadAcrossLoading',
      showPagination: 'readAcross/getShowPagination',
      disableDownload: 'readAcross/getDisableDownload',
      downloads: 'setup/getDownloadArray',
      predEngines: 'readAcross/getPredEngines',
      params: 'getParams',
      currentStep: 'getStep',
      readAcrossCols: 'readAcross/getCurrentReadAcrossCols',
      graSortOptions: 'readAcross/getGraSortOptions',
      rraSortOptions: 'readAcross/getRraSortOptions',
      graLatestSortOption: 'readAcross/getGraLatestSortOption',
    }),
    download: {
      get() {
        return this.downloadValue
      },
      set(updatedDownloadValue) {
        this.exportReadAcross(updatedDownloadValue)
      },
    },
    downloadTypes() {
      return this.downloads
        .filter(download => !download.rel || download.rel.includes('readacross'))
        .map(download => ({
          ...download, value: download.subdir, text: download.name, disabled: !download.data_exists,
        }))
    },
    currentPredEngine: {
      get() {
        return this.params.engine
      },
      set(val) {
        this.setPredEngine(val)
      },
    },
    sortByOptions() {
      return this.currentStep > 3 ? this.$utility.translateSelectOptions(this.rraSortOptions) : this.$utility.translateSelectOptions(this.graSortOptions)
    },
    predEngineTypes() {
      return this.$utility.translateSelectOptions(this.predEngines).map(i => ({...i}))
    },
    paginate: {
      get() { return this.showPagination },
      set() {
        this.$store.commit('readAcross/setShowPagination')
        this.$nuxt.$emit('setReadAcrossPagination')
      },
    },
    currentSortIcon() {
      // icons for alphabetacal sorts
      if (this.currentSortOption === 'alphaName') {
        if (this.currentSortOrder === 'asc') {
          return 'sort-alpha-down'
        }
        return 'sort-alpha-up-alt'
      }
      // default icons
      if (this.currentSortOrder === 'asc') {
        return 'sort-down-alt'
      }
      return 'sort-up'
    },
    isRraDisabled() {
      return !this.currentPredEngine
    },
    rraTitle() {
      if (this.isRraDisabled) {
        return 'Read acrosss cannot run for this combination of inputs'
      }
      return 'Run read across with currently selected inputs'
    },
  },
  watch: {
    minMinus(newVal, oldVal) {
      if (this.currentStep > 3 && !this.minMinusFromEvent) {
        this.$nuxt.$emit('showVerifyChange')
        this.$nextTick(() => {
          this.prevMin = oldVal
          this.minMinusFromEvent = false
        })
      }
      const updatedParams = {...this.params, neg0: newVal}
      this.setParams(updatedParams)
    },
    minPlus(newVal, oldVal) {
      if (this.currentStep > 3 && !this.minPlusFromEvent) {
        this.$nuxt.$emit('showVerifyChange')
        this.$nextTick(() => {
          this.prevPlus = oldVal
          this.minPlusFromEvent = false
        })
      }
      const updatedParams = {...this.params, pos0: newVal}
      this.setParams(updatedParams)
    },
    similarityWidth(newVal) {
      this.checkBox = newVal
    },
    currentSortOption(newVal, oldVal) {
      if (this.currentStep === 3) {
        this.setGraLatestSortOption({
          option: newVal,
          order: this.currentSortOrder,
        })
      }
      this.sortHandler(false)
    },
    readAcrossCols(newVal, oldVal) {
      if (!(this.readAcrossCols.some(col => col.field === this.currentSortOption))) {
        this.resetDefaultSort({option: this.graLatestSortOption.option, order: this.graLatestSortOption.order})
      }
      this.sortHandler(false)
    },
  },
  created() {
    this.$nuxt.$on('setMinPlus', ({cancel = false}) => {
      this.minPlusFromEvent = true
      const updatedVal = cancel ? this.prevPlus : this.$store.state.params.pos0
      this.minPlus = updatedVal
      this.$nextTick(() => {
        this.minPlusFromEvent = false
      })
    })
    this.$nuxt.$on('setMinMinus', ({cancel = false}) => {
      this.minMinusFromEvent = true
      const updatedVal = cancel ? this.prevMin : this.$store.state.params.neg0
      this.minMinus = updatedVal
      this.$nextTick(() => {
        this.minMinusFromEvent = false
      })
    })
    this.$nuxt.$on('resetSort', () => {
      this.resetDefaultSort()
      this.sortHandler(false)
    })
  },
  beforeMount() {
    this.checkBox = this.$store.state.readAcross.similarityWidth
    this.resetDefaultSort()
  },
  methods: {
    ...mapMutations({
      setFilter: 'readAcross/setFilter',
      setMinMinus: 'readAcross/setMinMinus',
      setMinPlus: 'readAcross/setMinPlus',
      setDownloadValue: 'readAcross/setDownloadValue',
      setGraLatestSortOption: 'readAcross/setGraLatestSortOption',
      setParams: 'setParams',
    }),
    ...mapActions({
      runReadAcross: 'readAcross/runReadAcross',
      downloadReadAcross: 'readAcross/downloadReadAcross',
      setSimilarityWidth: 'readAcross/setSimilarityWidth',
      setPredEngine: 'readAcross/setPredEngine',
    }),
    sortHandler(changeOrder = true) {
      if (changeOrder) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc'
      }
      if (this.currentStep === 3) {
        this.setGraLatestSortOption({
          ...this.graLatestSortOption,
          order: this.currentSortOrder,
        })
      }
      const columnState = {
        state: [
          {
            colId: this.currentSortOption,
            sort: this.currentSortOrder,
          },
        ],
        defaultState: {sort: null},
      }
      this.$nuxt.$emit('sortGrid', {columnState})
    },
    resetDefaultSort({order = 'asc', option = this.sortByOptions[0]?.value} = {}) {
      this.currentSortOrder = order
      this.currentSortOption = option
    },
    async checkboxHandler() {
      await this.setSimilarityWidth(!this.similarityWidth)
      this.$nuxt.$emit('similarChecked')
    },
    onSubmit(ev) {
      ev.preventDefault()
    },
    async exportReadAcross(value) {
      this.setDownloadValue(value)
      if (value !== null && value !== 'downloading') {
        await this.downloadReadAcross(value)
      }
    },
  },
}
</script>

<style scoped>
.label {
  font-weight: 700;
  font-size: 12px;
}
@media screen and (max-width: 992px) {
  .label {
    font-size: 0.9vw !important;
  }
  .dropdown-select {
    max-width: 100px !important;
  }
  .sort-helper-button {
    font-size:1.0vw;
  }
}
@media screen and (max-width: 1290px) {
  .dropdown-select {
    max-width: 100px !important;
  }
}
.read-across-nav {
  background-color: #e8f6fd!important;
  border-bottom: 1px solid #ddd;
  height: 4.8vh
}
.read-across-button {
  font-size: 0.8vw;
  background-color: #0e6993;
}
.sort-helper-button {
  background-color: #0e6993;
}
</style>
