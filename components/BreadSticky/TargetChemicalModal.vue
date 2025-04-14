<template>
  <b-modal
    v-model="show"
    title="Target Chemical"
    header-bg-variant="info"
    header-text-variant="light"
    hide-footer
    data-cy="target-chemical-modal"
    size="md"
  >
    <b-container fluid>
      <b-row v-if="dtxcid">
        <strong>DTXCID:</strong> <span class="ml-2">{{ dtxcid }}</span>
      </b-row>
      <b-row v-if="dtxsid" class="mt-2">
        <strong>DTXSID:</strong> <span class="ml-2">{{ dtxsid }}</span>
      </b-row>
      <b-row v-if="chemId" class="target-chemical-modal-chem-id mt-2">
        <strong>{{ chemdIdLabel }}:</strong> <span class="ml-2">{{ chemId }}</span>
      </b-row>
      <b-row v-if="chemName" class="mt-2">
        <strong>Name:</strong> <span class="ml-2">{{ chemName }}</span>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'

export default {
  name: 'TargetChemicalModal',
  props: {
    currentChemical: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapGetters({
      params: 'getParams',
    }),
    isMultiTarget() {
      return this.params.flags && this.params.flags === 'multitarget'
    },
    isCustomNn() {
      return this.params.flags && this.params.flags === 'usernn'
    },
    chemdIdLabel() {
      if (this.isMultiTarget) {
        return 'Targets'
      }
      if (this.isCustomNn) {
        return 'Neighbors'
      }
      return 'Chem ID'
    },
    dtxcid() {
      if (this.currentChemical.dsstox_cid && !this.isMultiTarget) {
        return this.currentChemical.dsstox_cid
      }
      return null
    },
    dtxsid() {
      if (this.currentChemical.dsstox_sid && !this.isMultiTarget) {
        return this.currentChemical.dsstox_sid
      }
      return null
    },
    chemId() {
      if (this.currentChemical.chem_id === this.dtxcid || this.currentChemical.chem_id === this.dtxsid) {
        return ''
      }
      if (this.isCustomNn && this.currentChemical.chem_id.includes(',')) {
        return this.currentChemical.chem_id.split(',').slice(1).join(',')
      }
      return this.currentChemical.chem_id
    },
    chemName() {
      if (this.currentChemical.name && !this.isMultiTarget) {
        return this.currentChemical.name
      }
      return null
    },
  },

}
</script>

<style scoped>
.target-chemical-modal-chem-id {
    word-break: break-all;
}

</style>
