<template>
  <div>
    <b-row>
      <b-col cols="12" class="text-center">
        <h6>
          <strong><u>Fingerprints</u></strong>
          <font-awesome-icon
            :icon="visible ? 'chevron-up' : 'chevron-down'"
            aria-controls="collapse-1"
            title="Click to show/hide custom available fingerprints"
            class="custom-neighborhood-collapse-icon"
            :aria-expanded="visible ? 'true' : 'false'"
            @click="expandHandler()"
          />
        </h6>
      </b-col>
    </b-row>
    <transition-group key="tgr" name="fade" mode="out-in">
      <b-row v-if="visible" key="row-0" class="fp-select-column">
        <b-form-group
          :key="`b-form-group-0`"
          v-slot="{ ariaDescribedby }"
          class="d-flex"
        >
          <b-form-checkbox-group
            :key="`${selected}3`"
            v-model="selected"
            data-cy="ne-cpanel-fp-grp"
            class="checkbox-group-container"
            :disabled="isExpanding"
            :options="fps"
            :aria-describedby="ariaDescribedby"
            switches
          />
        </b-form-group>
      </b-row>
      <b-row v-if="visible" :key="`row-1`">
        <b-col :key="`col-0`" cols="6">
          <span :key="`span-0`" class="pt-1 bottom-labels">
            <strong :key="`str-0`">Graph Type:</strong>
          </span>
        </b-col>
        <b-col :key="`col-1`" cols="6">
          <span :key="`span-1`" class="bottom-labels">
            <strong :key="`str-1`">Filter By:</strong>
          </span>
        </b-col>
      </b-row>
      <b-row v-if="visible" key="row-2">
        <b-col :key="`col-2`" cols="6">
          <b-form-select :key="`b-form-select-0`" v-model="graphTypeSelected" size="sm">
            <template #default>
              <b-form-select-option
                v-for="option in graphTypeOptions"
                :key="option.value"
                v-b-tooltip.hover
                :title="option.description"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.text }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
        <b-col :key="`col-3`" class="pl-1" cols="6">
          <b-form-select :key="`b-form-select-1`" v-model="selByVal" size="sm">
            <template #default>
              <b-form-select-option
                v-for="option in filterByOptions"
                :key="option.value"
                v-b-tooltip.hover
                :title="option.description"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.text }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
    </transition-group>
  </div>
</template>

<script>
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapMutations, mapActions,
} from 'vuex'

export default {
  name: 'RadialNeighborhoodControlPanelFingerprints',
  data() {
    return {
      graphFormSelections: {
        modifiedFps: [],
        selectedGraphType: '',
        selectedSelBy: '',
      },
      visible: true,
    }
  },
  computed: {
    ...mapGetters({
      isExpanding: 'radial/getNeighborhoodLoading',
      fingerprints: 'setup/getValidFpArray',
      fpColors: 'radial/getGraphFpColors',
      modifiedFps: 'radial/getModifiedGraphFps',
      graphTypes: 'radial/getGraphTypes',
      filterBy: 'setup/getValidFilterArray',
      selectedSelBy: 'radial/getNeighborhoodGraphFilterBy',
      params: 'getParams',
      selectedGraphType: 'radial/getSelectedGraphType',
    }),
    filterByOptions() {
      return this.$utility.translateSelectOptions(this.filterBy)
    },
    fps() {
      return this.fingerprints.filter(fp => fp.key !== 'hybrid' && fp.data_exists).map(fp => ({
        ...fp,
        html: `<div style='padding-top: 2px;'><div class='ml-2' style='background-color: ${this.fpColors[fp.key]}; height: 18px; width: 18px;float: right;'></div>${fp.name}</div>`,
        value: fp.key,
      }))
    },
    selected: {
      get() {
        return this.graphFormSelections.modifiedFps
      },
      set(newVal) {
        this.graphFormSelections.modifiedFps = newVal
      },
    },
    graphTypeSelected: {
      get() {
        return this.graphFormSelections.selectedGraphType
      },
      set(newGraphType) {
        this.graphFormSelections.selectedGraphType = newGraphType
      },
    },
    graphTypeOptions() {
      return this.graphTypes.map(gtype => ({
        ...gtype,
        value: gtype.key,
        text: gtype.name,
        disabled: !gtype.data_exists,
      }))
    },
    selByVal: {
      get() {
        return this.graphFormSelections.selectedSelBy
      },
      set(newSelBy) {
        this.graphFormSelections.selectedSelBy = newSelBy
      },
    },
    fpsEqual() {
      return (this.modifiedFps.length === this.graphFormSelections.modifiedFps.length && this.modifiedFps.every(value => this.graphFormSelections.modifiedFps.includes(value)))
    },
    graphTypeEqual() {
      return this.selectedGraphType === this.graphFormSelections.selectedGraphType
    },
    selByEqual() {
      return this.selectedSelBy === this.graphFormSelections.selectedSelBy
    },
  },
  beforeMount() {
    this.setSelectedGraphType(this.graphTypeOptions[0].value)
    this.setNeighborhoodSelBy(this.params.sel_by)
    this.resetSelections()
  },
  methods: {
    ...mapMutations({
      setSelectedGraphType: 'radial/setSelectedGraphType',
      setNeighborhoodSelBy: 'radial/setNeighborhoodGraphFilterBy',
      setModifiedFps: 'radial/setModifiedGraphFps',
    }),
    resetSelections() {
      if (!this.fpsEqual) {
        this.graphFormSelections.modifiedFps = this.modifiedFps
      }
      if (!this.graphTypeEqual) {
        this.graphFormSelections.selectedGraphType = this.selectedGraphType
      }
      this.selByVal = this.params.sel_by
      this.graphFormSelections.selectedSelBy = this.selByVal
    },
    expandHandler() {
      this.visible = !this.visible
      this.$nextTick(() => this.$emit('scrollToUpdateBtn'))
    },
    updateDisabled() {
      if (!this.graphFormSelections.modifiedFps.length) {
        return true
      }
      return (!(!this.fpsEqual || !this.graphTypeEqual || !this.selByEqual))
    },
  },
}
</script>

<style scoped>

.fp-select-column {
  padding-left: 5px;
}

.checkbox-group-container {
  display: inline-grid;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.custom-neighborhood-collapse-icon {
    color: #0B506F;
    float: right;
}
.custom-neighborhood-collapse-icon:hover {
    cursor: pointer;
}

</style>
