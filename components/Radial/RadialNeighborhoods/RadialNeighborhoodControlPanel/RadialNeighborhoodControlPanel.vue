
<template>
  <div id="ne-cpanel-container">
    <b-row class="mt-1 mr-1">
      <b-col cols="2">
        <b-button
          v-b-tooltip
          title="Reset graph to most recent loaded state(before any movement/dragging of chemicals occured)"
          variant="outline"
          size="sm"
          class="mb-1"
          @click="resetGraph"
        >
          <b-icon-bootstrap-reboot />
        </b-button>
      </b-col>
      <b-col cols="8" class="text-center">
        <h6><strong><u>Chemical Information</u></strong></h6>
      </b-col>
      <b-col cols="2">
        <b-button
          v-b-tooltip
          title="Download current graph data(nodes and edges) in JSON format"
          variant="outline"
          size="sm"
          data-cy="ne-cpanel-download-btn"
          class="mb-1 mr-1"
          @click="downloadGraph"
        >
          <b-icon-download />
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <transition name="fade" mode="out-in">
        <b-col v-if="initialLoad" key="load" cols="12" class="mt-1">
          <h5>Click a node to view chemical information.</h5>
        </b-col>
        <b-col v-else key="chemical" class="mt-2" cols="12">
          <b-row align-h="center" class="img-container mb-2">
            <b-col align-v="center" cols="5">
              <svg v-if="imageUrl" width="100" height="100">
                <image
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  :href="imageUrl"
                />
              </svg>
            </b-col>
            <b-col cols="7">
              <b-row>
                <h6>
                  <strong>
                    Name:
                  </strong>
                  {{ chemName }}
                </h6>
              </b-row>
              <b-row><h6><strong>Mol. Weight:</strong> {{ chemWeight }}</h6></b-row>
              <b-row><h6><strong>DTXCID:</strong>  {{ chemCid }}</h6></b-row>
              <b-row><h6><strong> DTXSID:</strong>  {{ chemSid }}</h6></b-row>
            </b-col>
          </b-row>
          <div class="text-center">
            <b-button
              v-if="!expanded"
              title="Expand neighborhood graph based upon the currently selected chemical/node."
              :disabled="isExpanding"
              variant="primary"
              size="sm"
              @click="expandSelectedNode"
            >
              Expand
            </b-button>
            <b-button
              v-if="!isFocused() && !zooming"
              :disabled="isExpanding"
              title="Zoom in and focus on currently selected chemical/node."
              variant="info"
              size="sm"
              @click="zoomCenterNode"
            >
              Focus Chemical
            </b-button>
            <b-button
              v-if="chemId !== params.chem_id"
              :disabled="isExpanding"
              title="Reset all and start a completely new GenRA workflow using this chemical as the target."
              variant="success"
              size="sm"
              @click="startGenraWorkflow"
            >
              GenRA <b-icon-play-circle font-scale="1" />
            </b-button>
          </div>
          <hr>
          <RadialNeighborhoodControlPanelCustomNeighborhood
            :current-chem-data="{
              chemName,
              chemWeight,
              isTarget,
              chemId,
              chemCid,
              chemSid,
              initialLoad
            }"
            :target-node="targetChemId"
            @scrollToUpdateBtn="scrollToUpdateBtn"
          />
        </b-col>
      </transition>
    </b-row>
    <hr>
    <div>
      <RadialNeighborhoodControlPanelFingerprintsVue
        ref="ne-cpanel-fps"
        @scrollToUpdateBtn="scrollToUpdateBtn"
      />
      <b-row class="justify-content-center mt-2">
        <b-button
          id="ne-cpanel-update-btn"
          :disabled="updateDisabled() || isExpanding"
          variant="success"
          data-cy="ne-cpanel-update-btn"
          :title="getUpdateButtonTitle"
          @click="updateGraph"
        >
          Update
        </b-button>
      </b-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapMutations, mapActions,
} from 'vuex'
import {debounce} from 'debounce'
import RadialNeighborhoodControlPanelCustomNeighborhood from './RadialNeighborhoodControlPanelCustomNeighborhood.vue'
import RadialNeighborhoodControlPanelFingerprintsVue from './RadialNeighborhoodControlPanelFingerprints.vue'

export default {
  name: 'RadialNeighborhoodControlPanel',
  components: {
    RadialNeighborhoodControlPanelCustomNeighborhood,
    RadialNeighborhoodControlPanelFingerprintsVue,
  },
  props: {
    userView: {
      type: Object,
      required: true,
    },
    graph: {
      type: Function,
      required: true,
    },
    zooming: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectd: null,
      chemName: '',
      chemWeight: '',
      chemCid: '',
      chemSid: '',
      isTarget: false,
      chemId: '',
      expanded: false,
      initialLoad: true,
    }
  },
  computed: {
    ...mapGetters({
      isExpanding: 'radial/getNeighborhoodLoading',
      graphData: 'radial/getNeighborhoodGraphData',
      params: 'getParams',
    }),
    imageUrl() {
      return this.$utility.imageUrl(this.chemCid).includes('undefined') ? '' : this.$utility.imageUrl(this.chemCid)
    },
    getUpdateButtonTitle() {
      if (this.updateDisabled()) {
        return 'You must change fingerprints and/or graph type to update'
      }
      if (this.isExpanding) {
        return 'Updated disabled while graph is loading'
      }
      return 'Update graph with newly selected options'
    },
  },
  methods: {
    ...mapActions({
      startGenra: 'radial/startGenraFromNeighborhoodGraph',
      downloadNEGraph: 'radial/downloadNeighborhoodGraph',
    }),
    updateDisabled() {
      const fpPanelRef = this.$refs['ne-cpanel-fps']
      if (fpPanelRef) {
        return this.$refs['ne-cpanel-fps']?.updateDisabled()
      }
      return true
    },
    loadChemical({
      // eslint-disable-next-line no-shadow
      name, mol_weight, dsstox_cid, dsstox_sid, expanded, id, fromInitialLoad = false, isTarget,
    }) {
      this.chemName = name
      this.chemWeight = mol_weight
      this.chemCid = dsstox_cid
      this.isTarget = isTarget
      this.chemId = id
      this.chemSid = dsstox_sid
      this.expanded = expanded
      this.initialLoad = fromInitialLoad
    },
    resetGraph() {
      this.$emit('resetGraphLayout')
    },
    expandSelectedNode() {
      const fpPanelRef = this.$refs['ne-cpanel-fps']
      this.$emit('expand', {chem_id: this.chemId, ...fpPanelRef?.graphFormSelections})
    },
    isFocused() {
      if (this.chemId) {
        const selectedNode = this.graph.graphData().nodes.find(node => node.id === this.chemId)
        return Math.abs(this.userView.x - selectedNode.x) <= 10 && Math.abs(this.userView.y - selectedNode.y) <= 10
      }
      return false
    },
    targetChemId() {
      const targetNode = this.graph.graphData().nodes.find(node => node.isTarget)
      return targetNode
    },
    zoomCenterNode() {
      this.$emit('viewNode', this.chemId)
    },
    updateGraph() {
      const fpPanelRef = this.$refs['ne-cpanel-fps']
      if (fpPanelRef) {
        this.$emit('updateGraph', fpPanelRef?.graphFormSelections)
      }
    },
    startGenraWorkflow() {
      this.startGenra({chemId: this.chemId, chemName: this.chemName})
    },
    // eslint-disable-next-line func-names
    downloadGraph: debounce(function() {
      const currentNodes = JSON.parse(JSON.stringify(this.graph.graphData()))
      const {
        links, nodes, ...newObj
      } = currentNodes
      newObj.nodes = nodes.map((node) => {
        const {
          // eslint-disable-next-line no-shadow
          dsstox_sid, dsstox_cid, name, mol_weight, expanded, isTarget,
        } = node
        const isNewTarget = isTarget || false
        return {
          dsstox_sid, dsstox_cid, name, mol_weight, expanded, isTarget: isNewTarget,
        }
      })
      newObj.edges = links.map((link) => {
        const {
          from, to, step, similarity, type,
        } = link
        return {
          from, to, step, similarity, type,
        }
      })
      this.$export.download(newObj, `genra_${this.getCurrentDateTime()}.json`, true)
    }, 500),
    // Scrolls Update Button into view on fingerprint & custom ne panel expansions
    scrollToUpdateBtn() {
      const updateBtn = document.getElementById('ne-cpanel-update-btn')
      if (updateBtn) {
        updateBtn.scrollIntoView()
      }
    },
    getCurrentDateTime() {
      const currentDate = new Date()
      return `${currentDate.getMonth() + 1}_${
        currentDate.getDate()}_${
        currentDate.getFullYear()}_${
        currentDate.getHours()}${
        currentDate.getMinutes()}${
        currentDate.getSeconds()}`
    },
  },
}
</script>

<style scoped>
ul {
  padding-left: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.checkbox-group-container {
  display: inline-grid;
}

</style>
