<template>
  <div class="genrapanel fingerprint">
    <b-overlay
      id="overlay-background"
      :show="fingerprintRefresh"
      variant="transparent"
      :spinner-type="displayBlur"
      opacity="0.65"
      blur="4px"
      rounded="sm"
    >
      <b-navbar toggleable="sm" class="fingerprint-nav">
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-text>
              <span class="label" data-cy="fp-nav-header">Summary Data Gap Analysis</span>
            </b-nav-text>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-nav class="ml-auto">
          <Help class="fp-help-icon" help-key="GENRA Summary Data Gap Analysis" size="fp" />
        </b-navbar-nav>
      </b-navbar>
      <div class="chartcontainer p-1">
        <FingerprintHeatGrid />
      </div>
    </b-overlay>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'
import Help from '~/components/Helpers/Help.vue'
import FingerprintHeatGrid from '~/components/Fingerprint/FingerprintHeatChart/FingerprintHeatGrid.vue'

export default {
  name: 'FingerprintHeatPanel',
  components: {
    Help,
    FingerprintHeatGrid,
  },
  computed: {
    ...mapGetters({
      currentStep: 'getStep',
      fingerprintRefresh: 'fingerprint/getFingerprintRefreshLoading',
    }),
    displayBlur() {
      if (this.fingerprintRefresh && this.currentStep >= 2) {
        return 'border'
      }
      return 'none'
    },
  },

}
</script>

<style scoped>

.fingerprint-nav {
  background-color: #e8f6fd!important;
  border-bottom: 1px solid #ddd;
  height: 3.5em;
}

.genrapanel {
   border-right: 1px solid #ddd;
   border-top: 1px solid #ddd;
   border-bottom: 1px solid #ddd;
   position: relative;
   z-index: 998;
}

.label {
  font-weight: 700;
  font-size: 14px;
  color: black;
}
.chartcontainer {
  padding-left: 0.5em;
  padding-top: 50px;
}

</style>
