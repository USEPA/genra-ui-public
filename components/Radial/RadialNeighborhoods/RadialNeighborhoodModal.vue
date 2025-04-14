
<template>
  <modal
    id="graph-modal"
    name="neighborHoodGraphModal"
    :max-height="getMaxHeight()"
    draggable
    height="95%"
    width="90%"
    scrollable
    resizable
    @opened="buildAndSetObserver()"
    @closed="closeNNModal()"
  >
    <b-overlay :show="show" rounded="sm">
      <b-container fluid class="modal-container">
        <b-row>
          <b-col id="ne-modal-header-column" class="header-column grabbable" cols="12" align-self="center">
            <h5 class="mt-2 text-center text-light">
              Neighborhood Exploration Graph
              <b-button data-cy="ne-open-help-btn" class="ne-open-help-btn" size="sm" variant="link" @click="openNeHelp">
                <b-icon-info-circle-fill />
                Click Here
              </b-button>
              <b-button data-cy="ne-modal-close" size="sm" variant="link" class="float-right text-light" @click="hideNNModal()">
                <b-icon-x />
              </b-button>
            </h5>
          </b-col>
          <b-col id="force-graph-container-col" cols="9">
            <div id="outer-container" class="force-graph-outer-container">
              <div id="force-graph-container" />
              <div v-if="!graphHasData" id="no-graph-data" class="no-graph-data-alert">
                <b-alert :show="!graphHasData" variant="danger" class="no-graph-data-b-alert">
                  Computed data for this specific set of fingerprints, graph type, and/or filter is unavailable. Please adjust inputs and try again.
                </b-alert>
              </div>
            </div>
          </b-col>
          <b-col id="ne-cpanel-container-column" cols="3" class="mt-2">
            <RadialNeighborhoodControlPanel
              ref="chemicalInfoToast"
              :user-view="userCurrentView"
              :graph="myNeighGraph"
              :zooming="isZooming"
              @expand="expandSelectedNode"
              @viewNode="viewSelectedNode"
              @updateGraph="updateGraph"
              @resetGraphLayout="resetGraphLayout"
            />
          </b-col>
        </b-row>
      </b-container>
    </b-overlay>
  </modal>
</template>

<script>
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapMutations, mapActions,
} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'
import RadialNeighborhoodControlPanel from './RadialNeighborhoodControlPanel/RadialNeighborhoodControlPanel.vue'

export default {
  name: 'RadialNeighborhoodModal',
  components: {
    RadialNeighborhoodControlPanel,
  },
  data() {
    return {
      myNeighGraph: () => {},
      currentSelectedChemId: '',
      userCurrentView: {},
      isZooming: true,
      lastUsedGraphData: {},
      graphHasData: true,
      graphSize: null,
    }
  },
  computed: {
    ...mapGetters({
      graphData: 'radial/getNeighborhoodGraphData',
      params: 'getParams',
      show: 'radial/getNeighborhoodLoading',
      fpColors: 'radial/getGraphFpColors',
      graphFps: 'radial/getGraphFps',
      helpTexts: 'helpTexts/getByPageUrl',
    }),
    canvasWidth() {
      return document.getElementById('force-graph-container').getBoundingClientRect().width
    },
    targetChemId() {
      return this.params.chem_id
    },
  },
  watch: {
    graphHasData(newVal, oldVal) {
      if (oldVal && !newVal) {
        document.getElementById('outer-container').style.height = `${this.graphSize.height}px`
        document.getElementById('force-graph-container').style.height = '0px'
        document.getElementById('force-graph-container').style.width = '0px'
      }
      if (!oldVal && newVal) {
        document.getElementById('force-graph-container').style.height = `${this.graphSize.height}px`
        document.getElementById('force-graph-container').style.width = `${this.graphSize.width}px`
      }
    },
  },
  mounted() {
    this.showNeighModal()
  },
  methods: {
    ...mapMutations({
      setNeighborhoodLoading: 'radial/setNeighborhoodLoading',
      setCustomNeighborhoodOptions: 'radial/setCustomNeighborhood',
    }),
    ...mapActions({
      getExpandedNodes: 'radial/getExpandedNodes',
      getUpdatedData: 'radial/updateGraph',
    }),
    hideNNModal() {
      this.graphHasData = true
      this.$modal.hide('neighborHoodGraphModal')
    },
    showNeighModal() {
      this.$modal.show('neighborHoodGraphModal')
    },
    getMaxHeight() {
      if (process.browser) {
        return Math.floor(window.innerHeight + 5)
      }
      return '100000'
    },
    getControlPanelColHeight() {
      // Set Control panel height
      const modal = document.getElementsByClassName('vm--modal')[0]
      const headerColumnHeight = document.getElementById('ne-modal-header-column')?.getBoundingClientRect()?.height
      if (modal && headerColumnHeight) {
        return (modal.getBoundingClientRect().height - headerColumnHeight) - 10
      }
      return ''
    },
    buildAndSetObserver() {
      this.buildGraph(this.graphData)
      this.setCustomNeighborhoodOptions([])
      const ro = new ResizeObserver((entries) => {
        if (this.myNeighGraph) {
          const rect = entries[0].contentRect
          const graphData = this.myNeighGraph.graphData() || convertGraphData(_cloneDeep(this.graphData))
          if (rect.width && rect.height) {
            this.graphSize = {height: this.getControlPanelColHeight() || rect.height, width: rect.width}
          }
          this.$nextTick(() => {
            this.myNeighGraph.graphData(graphData)
            this.myNeighGraph.width(rect.width).height(this.getControlPanelColHeight())
            // this.buildGraph(graphData, graphData, rect.height, rect.width, 50)
          })
        }

        const controlPanelCol = document.getElementById('ne-cpanel-container-column')
        if (controlPanelCol) {
          controlPanelCol.style.height = `${this.getControlPanelColHeight()}px`
        }
      })
      ro.observe(document.getElementById('force-graph-container'))
    },
    closeNNModal() {
      if (this.myNeighGraph) {
        this.myNeighGraph._destructor()
        this.currentSelectedChemId = ''
        this.userCurrentView = {}
        this.isZooming = true
        this.lastUsedGraphData = {}
        this.graphHasData = true
        this.graphSize = null
      }
      this.$emit('showNeighborhoodExploration', false)
    },
    viewSelectedNode(chemId = this.currentSelectedChemId.id, delay = 2000) {
      const nodeToClick = this.myNeighGraph.graphData().nodes.find(i => i.id === chemId)
      this.nodeClick(nodeToClick, delay)
    },
    getEdgeWidth(simWeight) {
      if (simWeight >= 0.45) {
        return 6.0
      }
      if (simWeight < 0.45 && simWeight > 0.2) {
        return 3.5
      }
      if (simWeight < 0.2) {
        return 1
      }
      return 1
    },
    // eslint-disable-next-line consistent-return
    async expandSelectedNode(node) {
      try {
        this.myNeighGraph.zoomToFit(1000)
        const expandedData = await this.getExpandedNodes(node)
        const currentGraphData = this.myNeighGraph.graphData()
        const expandedGraphData = this.convertGraphData(expandedData)
        this.mergeGraphData({currentGraphData, expandedGraphData})
        this.$refs.chemicalInfoToast.loadChemical(this.currentSelectedChemId)
        this.lastUsedGraphData = _cloneDeep(currentGraphData)
        await this.myNeighGraph.cooldownTime(10000)
        await this.myNeighGraph.graphData(currentGraphData)
        this.$refs.chemicalInfoToast.resetSelections()
        this.myNeighGraph.onEngineStop(() => {
          if (this.show) {
            this.viewSelectedNode()
          }
        })
      } catch (e) {
        return e
      } finally {
        this.setNeighborhoodLoading(false)
      }
    },
    // eslint-disable-next-line consistent-return
    async updateGraph(updatedFps) {
      try {
        const addingFps = updatedFps.length > this.graphFps.length
        this.myNeighGraph.zoomToFit(1000)
        const updatedData = await this.getUpdatedData(updatedFps)
        if (!Object.keys(updatedData.nodes).includes(this.currentSelectedChemId.id)) {
          this.currentSelectedChemId = ''
          this.$refs.chemicalInfoToast.initialLoad = true
        }
        const graphData = this.currentSelectedChemId ? this.refocusChem(this.convertGraphData(updatedData)) : this.convertGraphData(updatedData)
        this.lastUsedGraphData = _cloneDeep(graphData)
        await this.myNeighGraph.cooldownTime(10000)
        await this.myNeighGraph.graphData(graphData)
        this.graphHasData = !!(updatedData.edges.length && Object.keys(updatedData.nodes).length)
        this.setNeighborhoodLoading(false)
        if (this.graphHasData) {
          this.myNeighGraph.onEngineStop(() => {
            if (this.show) {
              if (this.currentSelectedChemId.id && this.graphHasData) {
                this.viewSelectedNode()
              }
            }
          })
        }
      } catch (e) {
        this.setNeighborhoodLoading(false)
        return e
      }
    },
    refocusChem(graphData) {
      const {nodes, links} = graphData
      const viewingIndex = nodes.findIndex(node => node.is === this.currentSelectedChemId)
      nodes[viewingIndex] = {
        ...nodes[viewingIndex],
        isViewing: true,
      }
      return {
        nodes, links,
      }
    },
    nodeClick(node, delay = 2000) {
      this.isZooming = true
      this.myNeighGraph.centerAt(node.x, node.y, 1000)
      this.myNeighGraph.zoom(3, delay)
      const {nodes} = this.myNeighGraph.graphData()
      nodes.forEach((nod) => {
        nod.isViewing = false
      })
      node.isViewing = true
      this.currentSelectedChemId = node
      this.$refs.chemicalInfoToast.loadChemical(node)
    },
    mergeGraphData({currentGraphData, expandedGraphData}) {
      const currentGraphLinkIdxs = currentGraphData.links.map(link => `${link.source.id}${link.target.id}`)

      for (let i = 0; i < expandedGraphData.links.length; i += 1) {
        if (!currentGraphLinkIdxs.includes(`${expandedGraphData.links[i].source.id}${expandedGraphData.links[i].target.id}`)) {
          currentGraphData.links.push(expandedGraphData.links[i])
        }
      }

      const currentGraphNodes = currentGraphData.nodes.map(cnode => cnode.id)
      for (let i = 0; i < expandedGraphData.nodes.length; i += 1) {
        if (currentGraphNodes.includes(expandedGraphData.nodes[i].id)) {
          const currentGraphUpdateIdx = currentGraphData.nodes.findIndex(cnode => cnode.id === expandedGraphData.nodes[i].id)
          currentGraphData.nodes[currentGraphUpdateIdx].expanded = currentGraphData.nodes[currentGraphUpdateIdx].expanded || expandedGraphData.nodes[i].expanded
        } else {
          currentGraphData.nodes.push(expandedGraphData.nodes[i])
        }
      }
    },
    convertGraphData(graphObj) {
      const edgesFromTree = [...new Set(graphObj.edges.map(i => i.to))]
      let nodesFromData = Object.keys(graphObj.nodes)
        .map(i => ({
          id: i, isTarget: graphObj.nodes[i].isTarget, ...graphObj.nodes[i],
        })).concat(edgesFromTree.map(i => ({id: i}))
          .filter(i => !Object.keys(graphObj.nodes).includes(i.id)))

      // find target neighbors
      const targets = graphObj.edges.filter(edge => edge.from === this.targetChemId).map(target => target.to)
      nodesFromData = nodesFromData.map(node => ({...node, isTargetNeighbor: targets.includes(node.id)}))
      const linksFromData = graphObj.edges.map(edge => ({
        ...edge,
        source: edge.from,
        target: edge.to,
      }))

      this.addCurvature(linksFromData)
      return {
        nodes: nodesFromData,
        links: linksFromData,
      }
    },
    addCurvature(linkData) {
      const selfLoopLinks = {}
      const sameNodesLinks = {}
      const curvatureMinMax = 0.5
      linkData.forEach((link) => {
        link.nodePairId = link.source <= link.target ? (`${link.source}_${link.target}`) : (`${link.target}_${link.source}`)
        const map = link.source === link.target ? selfLoopLinks : sameNodesLinks
        if (!map[link.nodePairId]) {
          map[link.nodePairId] = []
        }
        map[link.nodePairId].push(link)
      })

      // Compute the curvature for self-loop links to avoid overlaps
      Object.keys(selfLoopLinks).forEach((id) => {
        const links = selfLoopLinks[id]
        const lastIndex = links.length - 1
        links[lastIndex].curvature = 1
        const delta = (1 - curvatureMinMax) / lastIndex
        for (let i = 0; i < lastIndex; i += 1) {
          links[i].curvature = curvatureMinMax + i * delta
        }
      })
      // Compute the curvature for links sharing the same two nodes to avoid overlaps
      Object.keys(sameNodesLinks).filter(nodePairId => sameNodesLinks[nodePairId].length > 1).forEach((nodePairId) => {
        const links = sameNodesLinks[nodePairId]
        const lastIndex = links.length - 1
        const lastLink = links[lastIndex]
        lastLink.curvature = curvatureMinMax
        const delta = 2 * curvatureMinMax / lastIndex
        for (let i = 0; i < lastIndex; i += 1) {
          links[i].curvature = -curvatureMinMax + i * delta
          if (lastLink.source !== links[i].source) {
            // flip it around, otherwise they overlap
            links[i].curvature *= -1
          }
        }
      })
    },
    getColor(edgeType) {
      return this.fpColors[edgeType]
    },
    openNeHelp() {
      const child = window.open('about:blank', '_blank')
      child.document.write(`${this.helpTexts('GENRA Neighborhood Explorer').helpText}`)
      child.document.close()
    },
    resetGraphLayout() {
      this.myNeighGraph.graphData(_cloneDeep(this.lastUsedGraphData))
    },
    buildGraph(nnGraphData,
      convertedGraphData = null,
      height = null, width = null,
      cooldownTime = null) {
      const gData = convertedGraphData || this.convertGraphData(_cloneDeep(nnGraphData))
      this.lastUsedGraphData = _cloneDeep(gData)
      const graphContainer = document.getElementById('force-graph-container')
      if (graphContainer) {
        // eslint-disable-next-line no-undef
        // eslint-disable-next-line new-cap
        const myGraph = ForceGraph()(document.getElementById('force-graph-container'))
          .width(width || this.canvasWidth)
          .height(height || this.getControlPanelColHeight())
          .nodeLabel((node) => {
            const {
              dsstox_cid: cid, dsstox_sid: sid, name: chemName,
            } = node
            let returnStr = `${chemName}<br/>`
            if (cid) {
              returnStr += `${cid}<br/>`
            }
            if (sid) {
              returnStr += `${sid}<br/>`
            }
            return returnStr
          })
          .linkCurvature('curvature')
          .linkDirectionalArrowLength(8)
          .linkDirectionalArrowRelPos(1)
        // eslint-disable-next-line arrow-body-style
          .linkWidth(data => this.getEdgeWidth(data.similarity))
          .linkColor(edge => this.getColor(edge.type))
          .linkLabel('similarity')
          .onEngineStop(() => {
            if (this.currentSelectedChemId) {
              this.viewSelectedNode(this.currentSelectedChemId.id, 0)
            }
          })
          .onZoom(() => {
            this.isZooming = true
          })
          .onZoomEnd(({
            k, x, y,
          }) => {
            this.isZooming = true
            this.userCurrentView = {
              k, x, y,
            }
            // eslint-disable-next-line no-return-assign
            setTimeout(() => this.isZooming = false, 500)
          })
          .linkDirectionalArrowColor(() => '#3D3D3D')
          .nodeColor((node) => {
            if (node.isTarget) {
              return 'red'
            }
            if (node.expanded) {
              return 'green'
            }
            return '#205493'
          })
          .autoPauseRedraw(false)
        // eslint-disable-next-line no-undefined
          .nodeCanvasObjectMode((node) => {
            if (node.isTargetNeighbor) {
              return 'after'
            }
            if (node.isViewing) {
              return 'before'
            }
            return ''
          })
          .nodeCanvasObject((node, ctx) => {
            if (node.isTargetNeighbor) {
              ctx.fillRect(node.x - 4, node.y - 4, 8, 8)
            }

            // add ring just for node being viewed- circle
            if (node.isViewing && !node.isTargetNeighbor) {
              ctx.beginPath()
              ctx.arc(node.x, node.y, 4 * 1.4, 0, 2 * Math.PI, false)
              ctx.fillStyle = 'black'
              ctx.fill()
            }
            // square
            if (node.isViewing && node.isTargetNeighbor) {
              ctx.beginPath()
              ctx.rect(node.x - 4, node.y - 4, 8.2, 8.2)

              ctx.fillStyle = 'black'
              ctx.stroke()
            }
          })
          .onNodeDrag((node) => {
            const {nodes} = myGraph.graphData()
            nodes.forEach((dragNode) => {
              if (dragNode.id !== node.id) {
                dragNode.fx = dragNode.x
                dragNode.fy = dragNode.y
              }
            })
          })
          .onNodeDragEnd((node) => {
            node.fx = node.x
            node.fy = node.y
          })
          .cooldownTime(cooldownTime || 3000)
          .onNodeClick(node => this.nodeClick(node))
          .graphData(gData)
        // myGraph.d3Force('center', d3.forceCenter().strength(0.0001))
        // myGraph.d3Force('center', null)
        myGraph.d3AlphaDecay(0.001)
        this.myNeighGraph = myGraph
      }
    },
  },
}
</script>

<style scoped>
.force-graph-outer-container {
  border-right: 2px dotted grey;
}
#ne-cpanel-container-column {
  overflow-y: auto;
  overflow-x: hidden;
}
.modal-container {
  margin-left: 0px !important;
  padding-left: 0px !important;
}
:deep(.vue-modal-right) {
  width: 2px;
}
.window-header {
  height: 5%;
  width: 75%;
  border: 1px dotted grey;
  cursor: grab;
}
.header-column {
  background-color: #0B506F;
}
.grabbable {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

 /* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

.nn-help-icon:hover {
  cursor:  help !important
}
.no-graph-data-alert {
  margin-left: 25%;
  margin-top: 25%;
  text-align: center;
}

.no-graph-data-b-alert {
  width: 75%
}

.ne-open-help-btn {
  color: white;
}

</style>
