<template>
  <div data-cy="assay-panel" class="genrapanel-assay">
    <b-overlay
      id="overlay-background"
      class="assay-overlay"
      :show="assayDataLoading"
      variant="transparent"
      :spinner-type="displayBlur"
      opacity="0.65"
      blur="4px"
      rounded="sm"
    >
      <b-navbar toggleable="sm" class="assay-nav" sticky-top>
        <b-navbar-nav class="mr-auto">
          <b-nav-form>
            <label class="label">Group:</label>
            <b-form-select :disabled="runReadAcrossLoading" :value="params.summarise" size="sm" @change="groupByChangeHandler($event, 'group')">
              <template #default>
                <b-form-select-option
                  v-for="option in groupOptions"
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
            <label class="label">By:</label>
            <b-form-select
              :disabled="runReadAcrossLoading"
              data-cy="assay-panel-by-dropdown"
              :value="getByVal"
              size="sm"
              @change="groupByChangeHandler($event, 'by')"
            >
              <template #default>
                <b-form-select-option
                  v-for="option in byOptions"
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
        <b-navbar-nav class="ml-auto">
          <b-form-checkbox
            v-model="paginate"
            data-cy="show-pagination-checkbox"
            switch
            class="mr-4 mt-2 mb-2"
            aria-label="Control Pagination"
          >
            <label class="label">Pagination</label>
          </b-form-checkbox>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-button
            v-if="currentStep <= 2"
            data-cy="generate-data-matrix"
            :variant="readAcrossStepError ? 'warning' : 'primary'"
            :class="readAcrossStepError ? 'warning-button' : 'generate-button'"
            :disabled="readAcrossLoading || readAcrossStepError"
            @click="generateDataMatrix"
          >
            <template v-if="readAcrossLoading">
              <b-spinner small type="grow" />
              Loading...
            </template>
            <template v-else>
              <template v-if="readAcrossStepError">
                Read Across Error
              </template>
              <template v-else>
                Generate Data Matrix
              </template>
            </template>
          </b-button>
          <Help class="ml-4 assay-help-icon" help-key="GENRA Generate Data Matrix" size="assay" />
        </b-navbar-nav>
      </b-navbar>
      <AssayDataGrid />
    </b-overlay>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapActions} from 'vuex'
import debounce from 'debounce'
import Help from '~/components/Helpers/Help.vue'
import AssayDataGrid from '~/components/Assay/AssayDataChart/AssayDataGrid.vue'

export default {
  name: 'AssayDataPanel',
  components: {
    Help,
    // AssayDataChart,
    AssayDataGrid,
  },
  computed: {
    ...mapGetters({
      params: 'getParams',
      currentStep: 'getStep',
      assayDataChemicals: 'assay/getAssayChemicals',
      assayDataLoading: 'assay/getAssayDataLoading',
      readAcrossLoading: 'readAcross/getReadAcrossLoading',
      assayInputOptions: 'assay/getAssayInputOptions',
      showPagination: 'assay/getShowPagination',
      readAcrossStepError: 'readAcross/getReadAcrossStepError',
      runReadAcrossLoading: 'readAcross/getRunReadAcrossLoading',
      group: 'assay/getGroup',
      by: 'assay/getBy',
    }),
    displayBlur() {
      if (this.assayDataLoading && this.currentStep >= 2) {
        return 'border'
      }
      return 'none'
    },
    paginate: {
      get() { return this.showPagination },
      set(paginate) {
        this.$store.commit('assay/setShowPagination')
        this.$nuxt.$emit('setAssayPagination', paginate)
      },
    },
    byOptions() {
      const currentGroup = this.assayInputOptions.find(input => input.key === this.params.summarise)
      if (currentGroup && currentGroup.subFields) {
        return this.$utility.translateSelectOptions(currentGroup.subFields)
      }
      return []
    },
    getByVal() {
      return this.byOptions.some(option => option.value === this.params.sumrs_by) ? this.params.sumrs_by : this.byOptions[0]?.value
    },
    groupOptions() {
      return this.$utility.translateSelectOptions(this.assayInputOptions)
    },
  },
  methods: {
    ...mapActions({
      inputChangeHandler: 'assay/assayInputChangeHandler',
    }),
    generateDataMatrix() {
      this.$store.dispatch('setStep', 3)
    },
    // eslint-disable-next-line func-names
    groupByChangeHandler: debounce(function(ev, inputOption) {
      this.inputChangeHandler({ev, inputOption})
    }, 400),
  },
}
</script>

<style scoped>
.assay-overlay {
  height: 85%;
}
.assay-nav {
  background-color: #e8f6fd!important;
  border-bottom: 1px solid #ddd;
  height: 3.5em;
}

.genrapanel-assay {
   border-right: 1px solid #ddd;
   border-top: 1px solid #ddd;
   border-bottom: 1px solid #ddd;
   position: relative;
   height: 100%;
   z-index : 996;
}

.label {
  font-weight: 700;
  font-size: 14px;
}
.generate-button {
  font-size: 0.8vw;
  line-height: 1.2;
  background-color: #0e6993;
}
.warning-button {
  font-size: 0.8vw;
  line-height: 1.2;
}
.generate-button:hover {
  background-color: #095273;
}

@media screen and (max-width: 992px) {
  .genrapanel-assay  {
    border-left: 1px solid #ddd;
  }
  .generate-button {
    font-size: 1.2vw;
    line-height: 1.2;
  }
}
@media screen and (max-width: 1700px) {
  .generate-button {
    line-height: 1.0;
  }
}
</style>
