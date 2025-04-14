<template>
  <client-only>
    <div class="input-group nav-search-input-group" style="minWidth: 645px;">
      <b-modal
        id="ketcherModal"
        ref="ketcherModal"
        v-model="showKetcher"
        title="Ketcher Structure Editor"
        body-class="ketcher-container"
        header-bg-variant="dark"
        header-text-variant="light"
        header-class="modalHeader"
        footer-class="ketcher-footer"
        size="xl"
        scrollable
        static
        no-close-on-backdrop
      >
        <!-- <ketcher-search /> -->
        <ketcher-ui v-if="showKetcher" />
        <MultiTargetSearch :show="showMultiTargetModal" />
        <template #modal-footer="">
          <b-button size="sm" variant="warning" @click="cancelKetcherModal()">
            Cancel
          </b-button>
          <b-button size="sm" variant="success" @click="setKetcherValue()">
            Search for Structure
          </b-button>
        </template>
      </b-modal>
      <b-button title="Draw a chemical structure" variant="primary" class="mr-2" @click="showKetcherModal()">
        <b-icon icon="pencil-square" aria-hidden="true" /> Ketcher
      </b-button>
      <b-button
        size="sm"
        variant="primary"
        class="mr-2"
        data-cy="user-defined-search-button"
        title="User Defined search"
        @click="showMultiTargetModalHandler()"
      >
        <b-icon icon="card-list" aria-hidden="true" /> User-defined
      </b-button>
      <v-select
        :ref="'searchField'"
        v-model="selected"
        :filterable="false"
        :append-to-body="true"
        :options="options"
        :title="selected?.chem_id || selected"
        label="searchWord"
        :disabled="disableSearch"
        :select-on-key-codes="[13]"
        :map-keydown="handlers"
        data-cy="chemical-search-input"
        class="form-control home-search-input px-0 py-0"
        :placeholder="searchMessage"
        @search="onSearch"
        @input="selectOption"
        @search:blur="onSearchBlur"
      >
        <template slot="no-options">
          <span> {{ noResultsMessage }} <b-spinner v-if="searching" class="spinner" label="Loading..." /><template v-else>{{ searchMessage }}</template> </span>
        </template>
        <template slot="option" slot-scope="option">
          <div class="d-flex flex-row">
            <div>
              <b-img v-if="option.hasStructureImage" height="40" width="40" :src="imageUrl(option.chem_id)" />
            </div>
            <div class="font-weight-normal ml-2" data-cy="searchOptions">
              <span class="h6">{{ option.searchWord }}</span>
              <br> <span class="chem-id font-italic font-weight-lighter h6">{{ option.chem_id }}</span>
            </div>
          </div>
        </template>
        <template slot="selected-option" slot-scope="option">
          <div class="font-weight-normal">
            <span class="h6">{{ option.searchWord }}</span>
            <span data-cy="dtxsid" class="font-italic font-weight-lighter h6">{{ option.dtxsid }}</span>
          </div>
        </template>
      </v-select>
      <div class="input-group-append">
        <span class="input-group-text blue nav-search-icon">
          <b-icon-search />
        </span>
      </div>
    </div>
  </client-only>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapActions} from 'vuex'
/* eslint-disable no-else-return */
/* eslint-disable no-console */
import {debounce} from 'debounce'
import ketcherUi from '@/components/UI/Ketcher.vue'
import MultiTargetSearch from '@/components/UI/MultiTargetSearch.vue'

export default {
  name: 'HomepageSearchBox',
  components: {
    ketcherUi,
    MultiTargetSearch,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      errorMessage: '',
      noError: false,
      searchMessage: 'Start typing to search, use a chemical name, synonym, SMILES, DSSTOX CID or SID, CASRN, or InChI-Key.',
      noResultsMessage: null,
      options: [],
      searching: false,
      showKetcher: false,
      showMultiTargetModal: false,
      selected: '',
      tabIndex: -1,
    }
  },
  computed: {
    ...mapGetters({
      currentStep: 'getStep',
    }),
    disableSearch() {
      return this.currentStep > 0 && this.runReadAcrossLoading
    },
  },
  created() {
    this.$nuxt.$on('clear', () => {
      this.selectOption(null, true)
    })
    this.$nuxt.$on('searchEntry', (chemId) => {
      const chemical = {
        chem_id: chemId,
      }
      this.selected = chemId
      this.selectOption(chemical)
    })
    this.$nuxt.$on('updateSearchBox', (chemId) => {
      if (chemId) { this.selected = chemId }
    })
  },
  methods: {
    ...mapActions({
      setSmiles: 'chemical/setCurrentSmileString',
    }),
    imageUrl(chemId) {
      return this.$utility.imageUrl(chemId)
    },
    showKetcherModal() {
      this.showKetcher = true
    },
    showMultiTargetModalHandler() {
      this.$nuxt.$emit('showMultiTargetModal')
    },
    cancelKetcherModal() {
      this.showKetcher = false
    },
    async setKetcherValue() {
      try {
        const smilesSet = await this.setSmiles()
        const chemical = {
          chem_id: smilesSet,
        }
        const updateSearchBox = true
        this.$store.dispatch('setChemical', {chemical, updateSearchBox})
      } catch (e) {
        return e
      } finally {
        this.showKetcher = false
      }
      return true
    },
    onSearchBlur(e) {
      this.options = []
      this.noResultsMessage = null
    },
    determineSearch(searchType) {
      if (process.env.APPLICATION_GENRA_APP_BUILD === 'STAND-ALONE') {
        return this.$repositories.genra.chemicalSearch
      }
      if (process.env.APPLICATION_GENRA_APP_BUILD !== 'STAND-ALONE' && searchType === 'typeAhead') {
        return this.$repositories.chemicalSearch.startsWith
      }
      if (process.env.APPLICATION_GENRA_APP_BUILD !== 'STAND-ALONE' && searchType === 'matchesExactly') {
        return this.$repositories.chemicalSearch.matchesExactly
      }
      return this.$repositories.genra.chemicalSearch
    },
    selectOption(chemical, fromEvent = false) {
      // SET VUEX DATA? const setString = this.loadSearchedOn(chemical.searchMatch)
      if (chemical) {
        this.$store.dispatch('setChemical', {chemical})
      }
      if (chemical === null) {
        this.selected = null
      }
      if (chemical === null && !fromEvent) {
        this.$store.dispatch('setStep', 0)
      }
    },
    onSearch(search, loading) {
      this.noResultsMessage = null
      if (search.length > 2) {
        loading(true)
        this.search(loading, search, this)
      }
    },
    search: debounce((loading, search, vm) => {
      if (search.length <= '2') {
        vm.options = []
        loading(false)
        return
      // eslint-disable-next-line unicorn/prefer-includes
      } else if ((search.length > 2) && ((search.trim().toUpperCase().includes('DTXSID') && search.trim().length <= 8) || (search.trim().toUpperCase().includes('DTXCID') && search.trim().length <= 11))) {
        vm.options = []
        loading(false)
        return
      }
      try {
        vm.searching = true
        const searchApi = vm.determineSearch('typeAhead')
        searchApi(search)
          .then((results) => {
            if (results.length === 0) {
              vm.noResultsMessage = 'No results found. Please try again.'
            }
            vm.options = results
            vm.searching = false
            loading(false)
          })
          .catch(() => {
            vm.searching = false
            vm.$nuxt.$emit('chemicalSelectErr')
          })
      } catch (err) {
        if (err.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        } else if (err.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
          console.log(err.request)
        } else {
        // Something happened in setting up the request and triggered an Error
          console.log('Error', err.message)
        }
        loading(false)
      } finally {
        vm.options = []
        loading(false)
      }
    }, 500),
    handlers: (map, vm) => ({
      ...map,
      13: (e) => {
        e.preventDefault()
        if (e.key === 'Enter' && vm.search.length > 1) {
          vm.$parent.searching = true
          const searchApi = vm.$parent.determineSearch('matchesExactly')
          searchApi(vm.search)
            .then((results) => {
              vm.$parent.searching = false
              if (results.length === 0) {
                vm.$parent.options = []
                vm.$parent.noResultsMessage = 'No results found. Please try again.'
              }
              if (results.length >= 1) {
                vm.$parent.options = results
              }
            })
            .catch(() => {
              vm.$parent.searching = false
            })
          if (vm.search.length >= 3) {
            vm.typeAheadSelect()
          }
        }
      },
    }),
  },
}
</script>

<style lang="scss" scoped>
@media (min-width: 1200px) {
  .modal-xl {
    max-width: 100%;
    margin-left: 2rem;
    margin-right: 2rem;
  }
}
@media (min-width: 992px) {
  .modal-xl {
    max-width: 100%;
    margin-left: 2rem;
    margin-right: 2rem;
  }
}

.home-search-input {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 600px;
}

.ketcher-container {
  width: 100%;
  height: 100%;
}
.ketcher-footer {
  display: flex;
  justify-content: center;
}
.modalHeader {
  font-size: .8rem;
}
.blue-grey-text {
    opacity: 50;
}
.nav-search-input-group {
  margin-top: 0em;
  padding-right: .5em;
}
.nav-search-input-group :deep(.vs__search), :deep(.vs__search:focus) {
  font-size: 0.87em;
}
.home-search-input :deep(.vs__selected-options) {
  flex-wrap: nowrap;
  max-width: calc(100% - 40px);
}

.home-search-input :deep(.vs__selected) {
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
  &:deep(vs--open) {
    display: block;
  }
  &:deep(vs--loading) {
    display: block;
  }
  &:deep(vs--searching) {
    display: none;
  }
}

.home-search-input :deep(.vs__selected) div  {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.nav-search-icon {
  height: 2em;
}
.nav-search-input {
  height: 2em;
}
.spinner {
  color: #6c757d;
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
