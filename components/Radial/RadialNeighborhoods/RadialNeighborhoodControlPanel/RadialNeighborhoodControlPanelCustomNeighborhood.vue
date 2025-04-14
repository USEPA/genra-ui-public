<template>
  <div>
    <b-row class="justify-content-center text-center">
      <b-col class="text-center" cols="12">
        <h6>
          <strong><u>Custom Neighborhood</u></strong>
          <font-awesome-icon
            :icon="visible ? 'chevron-up' : 'chevron-down'"
            aria-controls="collapse-1"
            title="Click to show/hide custom neighborhood selection"
            class="custom-neighborhood-collapse-icon"
            :aria-expanded="visible ? 'true' : 'false'"
            @click="expandHandler()"
          />
        </h6>
      </b-col>
    </b-row>
    <transition name="fade" mode="out-in">
      <b-row v-if="visible">
        <b-col cols="12" offset-md="2" class="mb-1 pl-0">
          <b-button
            size="sm"
            variant="primary"
            :title="addButtonHoverText"
            :disabled="isAddChemicalDisabled"
            @click="addCustomNeighbor()"
          >
            <font-awesome-icon
              icon="plus-circle"
              aria-hidden="true"
            /> Add {{ currentChemData.chemName.length > 15 ? `${currentChemData.chemName.substring(0, 15)}...` : currentChemData.chemName }}
          </b-button>
        </b-col>
        <b-col class="mt-2" cols="1">
          <b-button
            size="sm"
            variant="danger"
            class="mt-2"
            :title="selected ? `Remove ${currentChemData.chemName} from the custom neighborhood list.` : ''"
            :disabled="!selected"
            @click="removeChemical(selected)"
          >
            <font-awesome-icon
              icon="minus-circle"
              aria-hidden="true"
            />
          </b-button>
        </b-col>
        <b-col class="ml-2" cols="10">
          <b-form-select
            id="custom-neighborhood-form-select"
            v-model="selected"
            :select-size="3"
            @change="customNeighborhoodSelectHandler"
          >
            <template #default>
              <b-form-select-option
                v-for="option in options"
                :key="option.value"
                v-b-tooltip
                :title="option.text"
                :value="option.value"
                :disabled="option.disabled"
                @click="customNeighborhoodSelectHandler"
              >
                {{ option.text }}
              </b-form-select-option>
            </template>
          </b-form-select>
          <div class="mt-1 text-center custom-neighbors-count">
            Custom Neighbors(max 15): <strong>{{ options.length }}</strong>
          </div>
        </b-col>
        <b-col class="text-center" cols="12">
          <b-button
            variant="success"
            title="Run GenRA with selected custom neighbors"
            size="sm"
            class="mt-2"
            :disabled="options.length < 1"
            @click="runGenraCustomNeighborhoodHandler"
          >
            GenRA <b-icon-play-circle font-scale="1" />
          </b-button>
        </b-col>
      </b-row>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapMutations, mapActions,
} from 'vuex'

export default {
  name: 'RadialNeighborhoodControlPanelCustomNeighborhood',
  components: {

  },
  props: {
    currentChemData: {
      required: true,
      type: Object,
    },
    targetNode: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      selected: null,
      visible: false,
    }
  },
  computed: {
    ...mapGetters({
      options: 'radial/getCustomNeighborhood',
      params: 'getParams',
    }),
    addButtonHoverText() {
      if (this.options.length > 14) {
        return 'Max of 15 neighbors can be added.'
      }
      if (this.options.some(option => option.value === this.currentChemData.chemId)) {
        return `${this.currentChemData.chemName} has already been added.`
      }
      return `Add ${this.currentChemData.chemName} to custom neighborhood list.`
    },
    isAddChemicalDisabled() {
      return this.options.length > 14 || this.options.some(option => option.value === this.currentChemData.chemId) || this.currentChemData.isTarget
    },
  },
  methods: {
    ...mapMutations({
      addChemical: 'radial/addChemicalCustomNeighborhood',
      removeChemicalFromOptions: 'radial/removeChemicalCustomNeighborhood',
    }),
    ...mapActions({
      startGenra: 'radial/startGenraFromNeighborhoodGraph',
    }),
    customNeighborhoodSelectHandler(e) {
      this.selected = e?.target?.value
    },
    addCustomNeighbor() {
      if (this.isAddChemicalDisabled) {
        return
      }
      this.addChemical(({value: this.currentChemData.chemId, text: this.currentChemData.chemName}))
    },
    expandHandler() {
      this.visible = !this.visible
      this.$nextTick(() => this.$emit('scrollToUpdateBtn'))
    },
    removeChemical(chem) {
      if (chem) {
        this.removeChemicalFromOptions(chem)
        this.selected = null
      }
    },
    runGenraCustomNeighborhoodHandler() {
      const chemList = this.options.map(option => option.value)
      chemList.unshift(this.targetNode().id)
      this.startGenra({fromCustomNn: true, chemId: chemList.join(',')})
    },
  },

}
</script>

<style scoped>
.custom-neighborhood-collapse-icon {
    color: #0B506F;
    float: right;
}
.custom-neighborhood-collapse-icon:hover {
    cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.custom-neighbors-count {
  font-size: 12px;
}
</style>
