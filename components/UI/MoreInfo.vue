<template>
  <b-modal
    v-model="show"
    title="About GenRA"
    data-cy="about-genra-modal"
    modal-class="about-genra-modal"
    content-class="about-genra-modal-content"
    body-class="about-genra-modal-body"
    header-bg-variant="info"
    header-class="about-genra-modal-header"
    header-text-variant="light"
    hide-footer
  >
    <b-container fluid>
      <b-row>
        <b-col class="about-header">
          <h6>
            <strong>Version:</strong> {{ versionData }}
          </h6>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="about-header mt-2" cols="12">
          <h6>
            <strong>Contact: </strong>
            <a
              title="Contact GenRA"
              target="_blank"
              rel="noreferrer noopener"
              href="mailto:genra.support@epa.gov?subject=Comments on GenRA"
            >
              genra.support@epa.gov <b-icon-envelope-fill />
            </a>
          </h6>
        </b-col>
        <b-col class="about-header mt-2" cols="12">
          <h6>
            <strong>Documentation: </strong>
            <a
              title="GenRA Documentation"
              target="_blank"
              rel="noreferrer noopener"
              href="https://www.epa.gov/chemical-research/generalized-read-across-genra-manual"
            >
              GenRA Documentation <b-icon-book-half />
            </a>
          </h6>
        </b-col>
        <b-col class="about-header mt-2" cols="12">
          <h6>
            <strong>Publications: </strong>
            <a
              title="GenRA Publication"
              target="_blank"
              rel="noreferrer noopener"
              href="https://doi.org/10.1016/j.yrtph.2016.05.008"
            >
              2016
            </a>
            ,
            <a
              title="GenRA Publication"
              target="_blank"
              rel="noreferrer noopener"
              href="https://doi.org/10.1016/j.comtox.2022.100258"
            >
              2022
            </a>
          </h6>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'About',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      showAbout: 'getShowAbout',
      versionData: 'getVersionData',
    }),
    show: {
      get() {
        return this.showAbout
      },
      set(val) {
        this.setShowAbout(val)
      },
    },
  },
  methods: {
    ...mapMutations({
      setShowAbout: 'setShowAbout',
    }),
  },
}
</script>

<style scoped>
.about-header {
    text-align: center;
}

:deep(.about-genra-modal-content) {
    width: fit-content !important;
}

:deep(.about-genra-modal-body) {
    width: fit-content !important;
}

:deep(.about-genra-modal-header) {
    text-align: center;
}
</style>
