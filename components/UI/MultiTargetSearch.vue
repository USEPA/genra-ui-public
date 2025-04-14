<template>
  <b-modal
    id="multiTargetModal"
    ref="multiTargetModal"
    v-model="show"
    ok-title="Search"
    :ok-disabled="disableSearch"
    title="User Defined Search"
    body-class="multi-target-modal-container"
    header-bg-variant="dark"
    header-text-variant="light"
    header-class="multi-target-modal-header"
    footer-class="multi-target-modal-footer"
    size="md"
    scrollable
    no-close-on-backdrop
    @ok="search"
  >
    <b-form-textarea
      id="multi-target-search-text-area"
      v-model="searchText"
      placeholder="Enter Target Chemicals"
      rows="5"
    />
    <b-form-text id="multi-target-search-help-text">
      Target chemicals may consist of SID's, CID's, SMILES, or CASRN's and must be separated by commas or placed on separate lines. <br>
      <strong>ex: DTXCID90710, DTXSID3040352, 80-05-7, O=C=O</strong>
    </b-form-text>
    <b-form-checkbox
      v-model="predictions"
      data-cy="user-defined-all-predictions-checkbox"
      class="mr-4 mt-2 mb-2"
      aria-label="Make predictions for all chemicals"
      value="multitarget"
      unchecked-value="usernn"
    >
      Make predictions for all chemicals
    </b-form-checkbox>
  </b-modal>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'MultiTargetSearch',
  data() {
    return {
      show: false,
      searchText: '',
      predictions: 'usernn',
    }
  },
  computed: {
    disableSearch() {
      return !this.searchText || !this.searchText.trim().length || this.searchText.trim() === ','
    },
  },
  created() {
    this.$nuxt.$on('showMultiTargetModal', () => {
      this.show = !this.show
    })
    this.$nuxt.$on('clear', () => {
      this.predictions = 'usernn'
    })
  },
  methods: {
    ...mapActions({
      setChemical: 'setChemical',
    }),
    search() {
      const chemical = {chem_id: this.searchText.split(/[,\\\n]/).filter(str => str.length).map(str => str.trim()).join(',')}
      this.setChemical({
        chemical, updateSearchBox: true, fromMultiTarget: true, multiTargetFlag: this.predictions,
      })
    },
  },

}
</script>

<style>

</style>
