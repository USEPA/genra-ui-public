<template>
  <div class="read-across-panel">
    <b-modal
      id="rraModal"
      ref="rraModal"
      data-cy="rra-selection-modal"
      title="Verify selected analogues change"
      header-bg-variant="dark"
      header-text-variant="light"
      header-class="modalHeader"
      footer-class="readacross-container"
      return-focus=".read-across-button"
      centered
      no-close-on-backdrop
    >
      <div id="verifyChange">
        Changing selected columns will require re-calculating predictions, click "reset" to clear current predictions and "Run Read-Across" again, or "cancel" to retain current predictions.
      </div>
      <template #modal-footer="">
        <b-button data-cy="rra-selection-modal-cancel-btn" size="sm" variant="success" @click="cancelVerify()">
          Cancel
        </b-button>
        <b-button data-cy="rra-selection-modal-reset-btn" size="sm" variant="danger" @click="resetGra()">
          Reset
        </b-button>
      </template>
    </b-modal>
    <b-overlay
      id="overlay-background"
      :show="readAcrossLoading"
      variant="transparent"
      :spinner-type="displayBlur"
      opacity="0.65"
      blur="4px"
      rounded="sm"
    >
      <ReadAcrossHeader />
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-1 ml-auto" />
          <div class="col d-flex justify-content-center">
            <read-across-grid />
          </div>
          <div class="col-1" />
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable dot-notation */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import {mapGetters, mapActions} from 'vuex'
import ReadAcrossHeader from '~/components/ReadAcross/ReadAcrossHeader/ReadAcrossHeader.vue'
import ReadAcrossGrid from '~/components/ReadAcross/ReadAcrossChart/ReadAcrossGrid.vue'

export default {
  name: 'ReadAcrossPanel',
  components: {
    ReadAcrossHeader,
    ReadAcrossGrid,
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    ...mapGetters({
      readAcrossLoading: 'readAcross/getReadAcrossLoading',
      currentStep: 'getStep',
      similarityWidth: 'readAcross/getSimilarityWidth',
    }),
    displayBlur() {
      if (this.readAcrossLoading && this.currentStep >= 3) {
        return 'border'
      }
      return 'none'
    },
  },
  created() {
    this.$nuxt.$on('showVerifyChange', () => {
      // this.showModal = true
      this.$refs['rraModal'].show()
    })
    this.$nuxt.$on('cancelModal', () => {
      this.showModal = false
    })
  },
  methods: {
    ...mapActions({
      setSimilarityWidth: 'readAcross/setSimilarityWidth',
    }),
    async resetGra() {
      try {
        this.$store.commit('readAcross/setReadAcrossLoading', true)
        this.$store.dispatch('setStep', 3)
        await this.setSimilarityWidth(this.similarityWidth)
        this.$nuxt.$emit('similarChecked')
        this.$refs['rraModal'].hide()
        this.$store.commit('readAcross/setReadAcrossLoading', false)
        this.$nuxt.$emit('setMinMinus', {cancel: false})
        this.$nuxt.$emit('setMinPlus', {cancel: false})
        return false
      } catch (e) {
        this.$store.dispatch('setStep', 4)
        this.$store.commit('readAcross/setReadAcrossLoading', false)
        this.$store.commit('setErrorMsg', 'Error Resetting Read Across Panel.')
        this.$store.commit('readAcross/setRunReadAcrossError', true)
        this.cancelVerify()
        return false
      }
    },
    cancelVerify() {
      this.$refs['rraModal'].hide()
      this.$nuxt.$emit('setMinPlus', {cancel: true})
      this.$nuxt.$emit('setMinMinus', {cancel: true})
    },
  },
}
</script>

<style scoped>
.read-across-panel {
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  z-index: 996;
}
.readacross-container {
  display: flex;
  justify-content: center;
}
.modalHeader {
  font-size: .8rem;
}
</style>
