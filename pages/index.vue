<template>
  <b-container class="app-container" fluid>
    <b-toast
      id="header-footer-toast"
      cy-data="header-toast"
      toaster="b-toaster-top-right"
      title="EPA Header & Footer"
      no-auto-hide
      variant="info"
    >
      The EPA's header and footer has been minimized to improve GenRA's viewing experience. To
      display the EPA's header and footer press the minimize(<b-icon-arrows-collapse />) icon on the navbar above this message.
    </b-toast>

    <div v-if="Object.keys(chemical).length > 0 && radialLoading" class="spinner-container" align="center">
      <b-spinner label="Loading..." />
    </div>
    <b-modal
      id="error-modal"
      variant="danger"
      ok-only
      centered
      header-bg-variant="danger"
      header-text-variant="light"
      title="Error"
      :visible="showErrorModal"
      @hide="closeErrorModalHandler"
    >
      <p class="my-4">
        {{ errorMsg }}
      </p>
    </b-modal>
    <b-row class="breadsticky">
      <b-col class="bread-sticky">
        <Breadsticky :step="loadedStep" />
      </b-col>
    </b-row>
    <b-row class="top clearfix">
      <b-col
        sm="12"
        md="7"
        lg="4"
        xl="4"
        cols="12"
        class="radial-column"
      >
        <transition enter-active-class="animate__animated animate__fadeInLeft animate__delay-0.2s" leave-active-class="animate__animated animate__fadeOutLeft animate__delay-0.2s" mode="out-in">
          <RadialPanel
            v-if="chemicals.length && !radialLoading"
            class="h-100"
          />
        </transition>
      </b-col>
      <b-col
        sm="12"
        md="5"
        lg="3"
        xl="3"
        cols="12"
        class="fingerprint-column"
      >
        <transition enter-active-class="animate__animated animate__fadeIn animate__delay-0.2s" leave-active-class="animate__animated animate__fadeOut animate__delay-0.2s" mode="out-in">
          <FingerprintHeatPanel
            v-if="heatChemicals.length && assaygridColumns.length && !fingerprintLoading && loadedStep >= 2"
            class="h-100"
          />
        </transition>
      </b-col>
      <b-col
        sm="12"
        md="12"
        lg="5"
        xl="5"
        cols="12"
        :class="assaygridColumns.length && loadedStep >= 2 ? 'assay-column flex-column' : ''"
      >
        <transition enter-active-class="animate__animated animate__fadeInRight animate__delay-0.2s" leave-active-class="animate__animated animate__fadeOutRight animate__delay-0.2s" mode="out-in">
          <AssayDataPanel
            v-if="heatChemicals.length && assaygridColumns.length && !fingerprintLoading && loadedStep >= 2"
          />
        </transition>
      </b-col>
      <b-col cols="12" class="read-across-row">
        <transition enter-active-class="animate__animated animate__fadeInUp animate__delay-0.2s" leave-active-class="animate__animated animate__fadeOutDown animate__delay-0.2s" mode="out-in">
          <ReadAcrossPanel v-if="loadedStep >= 3" />
        </transition>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapActions} from 'vuex'
import Breadsticky from '~/components/BreadSticky/BreadSticky.vue'
import RadialPanel from '~/components/Radial/RadialPanel.vue'
import FingerprintHeatPanel from '~/components/Fingerprint/FingerprintHeatPanel.vue'
import AssayDataPanel from '~/components/Assay/AssayDataPanel.vue'
import ReadAcrossPanel from '~/components/ReadAcross/ReadAcrossPanel.vue'

export default {
  name: 'GenRA',
  components: {
    Breadsticky,
    RadialPanel,
    FingerprintHeatPanel,
    AssayDataPanel,
    ReadAcrossPanel,
  },
  props: {
    chem: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      loadedStep: 'getStep',
      errorMsg: 'getErrorMsg',
      chemicals: 'radial/getNeighborChemicals',
      heatChemicals: 'fingerprint/getFingerPrintGridData',
      chemical: 'chemical/getChemical',
      assaygridColumns: 'assay/getAssayGridCols',
      radialLoading: 'radial/getRadialPanelLoading',
      chemicalSelectErr: 'chemical/getChemicalSelectError',
      fingerprintHeatErr: 'fingerprint/getFingerprintHeatPanelError',
      fingerprintLoading: 'fingerprint/getFingerprintHeatPanelLoading',
      assayPanelError: 'assay/getAssayDataPanelError',
      readAcrossError: 'readAcross/getReadAcrossError',
      runReadAcrossError: 'readAcross/getRunReadAcrossError',
      getSettings: 'settings/getSettings',
      params: 'radial/getLastWorkingRadialParams',
    }),
    showErrorModal() {
      return this.chemicalSelectErr || this.fingerprintHeatErr || this.assayPanelError || this.runReadAcrossError || this.readAcrossError
    },
    fp() {
      return this.params.fp
    },
    numOfAnalogues() {
      return this.params.k0
    },
    maxHeight() {
      if (this.numOfAnalogues >= 14) {
        return '655px'
      }
      if (this.numOfAnalogues >= 13) {
        return '595px'
      }
      if (this.numOfAnalogues >= 11) {
        return '565px'
      }
      return '525px'
    },
  },
  created() {
    this.$nuxt.$on('chemicalSelectErr', () => {
      this.$store.commit('setErrorMsg', 'Error retrieving data for chemical/Fingerprint. Please try again.')
      this.$store.commit('chemical/setChemicalSelectError', true)
    })
    if (this.chem.length && this.loadedStep < 1) {
      this.$nuxt.$emit('searchEntry', this.chem)
    }
  },
  beforeMount() {
    this.getVersionData()
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit('setShowEpaHeader')
    }, 1000)
    setTimeout(() => {
      this.$bvToast.show('header-footer-toast')
    }, 2000)
  },
  methods: {
    ...mapActions({
      getVersionData: 'getGenraVersionData',
    }),
    closeErrorModalHandler() {
      if (this.chemicalSelectErr) {
        this.$store.dispatch('resetState', this.fp)
        this.$store.dispatch('setStep', 0)
        this.$nuxt.$emit('clear', null)
        return
      }
      if (this.fingerprintHeatErr || this.assayPanelError) {
        this.$store.dispatch('clearFpErrModal')
        this.$store.dispatch('setStep', 1)
        return
      }
      if (this.readAcrossError) {
        this.$store.dispatch('clearReadAcrossModal')
        if (this.loadedStep > 2) { this.$store.dispatch('setStep', 2) }
        return
      }
      if (this.runReadAcrossError) {
        this.$store.commit('readAcross/setRunReadAcrossError', false)
      }
    },
  },
}
</script>

<style scoped>
.read-across-row {
  margin-bottom: 5px;
  z-index: 996;
  padding-left: 4px;
  padding-right: 4px;
}
.top {
  max-height: 100%;
  /* overflow: auto; */
}
.fingerprint-column, .assay-column, .radial-column {
  min-height: 460px;
  max-height: v-bind(maxHeight)
}
.spinner-container {
  height: 60vh;
  color: #6c757d;
  position: absolute;
  top: 50%;
  left: 50%;
}
.bread-sticky {
  padding-right: 4px;
  padding-left: 4px;
}
.fingerprint-column {
  padding-left: 0px;
  padding-right: 0px;
}
.radial-column {
  padding-right: 0px;
  padding-left: 4px;
}
.assay-column {
  padding-left: 0px;
  padding-right: 4px;
}
@media screen and (max-width: 992px) {
  .assay-column {
    padding-left: 4px !important;
    padding-right: 0px;
  }
  .read-across-row {
    padding-right: 0px;
  }
}

</style>
