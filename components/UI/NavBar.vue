<template>
  <div class="nav-container fluid">
    <b-navbar data-cy="genraHeader" toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand>
        <b-link href="https://www.epa.gov" title="Go to the EPA home page" rel="home">
          <img src="~/assets/epa_logo.png">
        </b-link>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <span class="genra-title">Generalized Read-Across (GenRA)</span>
        <div class="ml-auto mr-2">
          <span
            title="View GenRA version, contact link, and documentation link"
            class="genra-title"
          >
            <a data-cy="navbar-more-info-link" class="genra-title about-link text-nowrap" @click="showAbout(true)">
              <b-icon-info-circle-fill />
              More Info
            </a>
          </span>
        </div>
        <div class="ml-auto">
          <header-search-box />
        </div>
        <b-button
          size="sm"
          variant="outline-secondary"
          class="expand-icon mb-2"
          aria-label="Show/Hide EPA Header"
          :title="showEpaHeader ? 'Hide EPA Header': 'Show EPA Header'"
          @click="showHideEpaHeader"
        >
          <b-icon v-if="showEpaHeader" icon="arrows-expand" aria-label="Hide EPA Header" />
          <b-icon-arrows-collapse v-else />
        </b-button>
      </b-collapse>
      <MoreInfo />
    </b-navbar>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapMutations} from 'vuex'
import HeaderSearchBox from '~/components/UI/HeaderSearchBox.vue'
import MoreInfo from '~/components/UI/MoreInfo.vue'

export default {
  name: 'GenraHeader',
  components: {
    HeaderSearchBox,
    MoreInfo,
  },
  computed: {
    ...mapGetters({
      showEpaHeader: 'getShowEpaHeader',
    }),
  },
  methods: {
    ...mapMutations({
      showHideEpaHeader: 'setShowEpaHeader',
      showAbout: 'setShowAbout',
    }),
  },

}
</script>

<style scoped>

.about-link:hover {
  cursor: pointer;
}
.bg-primary {
    background-color: #0e6993!important;
}
.genra-title {
    margin-left: 20px;
    color : white;
}
.expand-icon {
  background-color: white
}
.expand-icon:hover {
  background-color: rgb(117, 114, 114)
}

</style>
