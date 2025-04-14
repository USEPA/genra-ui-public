<template>
  <div class="chartcontainer pl-2">
    <div ref="assayheader" class="chartheaders thead">
      <div class="assaylabel" />
      <div v-for="chemical in chemicals" :key="chemical.chem_id" class="chemlabel">
        <span :title="chemical.name">{{ chemical.name }}</span>
      </div>
    </div>
    <div id="itemList">
      <div v-for="(assay, i) in determineList" :key="i" class="rows" data-cy="assay-items">
        <div class="assaylabel" :title="assays[assay].text">
          <span class="hover">
            {{ assay }}
          </span>
        </div>
        <div
          v-for="chemical in chemicals"
          :key="chemical.chem_id"
          :class="[ !chemical.assays[assay].value ? 'white' : 'black', 'cell' ]"
        />
      </div>
    </div>
    <b-pagination
      v-if="showPagination"
      v-model="currentPage"
      class="pagination pt-2"
      pills
      size="sm"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="itemList"
      align="center"
    />
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'

export default {
  name: 'AssayDataChart',
  components: {
  },
  data() {
    return {
      currentPage: 1,
      perPage: 8,
    }
  },
  computed: {
    ...mapGetters({
      chemicals: 'assay/getAssayChemicals',
      showPagination: 'assay/getShowPagination',
    }),
    assays() {
      return this.chemicals[0].assays
    },
    assayKeys() {
      let retVal = ''
      if (this.chemicals[0].assays) {
        retVal = Object.keys(this.chemicals[0].assays).sort() || ''
      }
      return retVal
    },
    rows() {
      return this.assayKeys.length
    },
    itemsForList() {
      return this.assayKeys.slice((this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage,)
    },
    determineList() {
      return this.showPagination ? this.itemsForList : this.assayKeys
    },
  },
  created() {
    this.$nuxt.$on('resetPagination', () => {
      this.currentPage = 1
    })
  },
}
</script>

<style scoped>
.chartcontainer {
  margin: auto;
  display: inline-block;
  width: 100%;
  overflow: auto;
  max-height: 53vh;
}
.chartheaders {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background: white;
  display: flex;
  flex-flow: row nowrap;
}
.chemlabel {
  height: 9em;
  width: 1.88vw;
  font-size: 0.65vw;
  white-space: nowrap;
  transform: rotate(-60deg) translate(-2.3em, 5.77em);
  margin: 1px;
}
.chemlabel > span {
  display: inline-block;
  width: 10em;
  text-align: left;
  border-bottom: 1px dashed grey;
  text-overflow: ellipsis;
  overflow: hidden;
}
.rows {
  display: flex;
  flex-flow: row nowrap;
}
.assaylabel {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 12em;
  font-size: 0.75vw;
  text-align: right;
  line-height: 3.0vh;
  height: 30px;
}
.assaylabel > span {
  border-bottom: 1px dashed grey;
}
.cell {
  width: 1.87vw;
  height: 3.0vh;
  /* margin: 1px; */
  margin-left: 0.07vw;
  margin-right: 0.07vw;
  margin-top: 0.065vh;
  margin-bottom: 0.065vh;
  flex-shrink: 0;
}
.black {
  background-color: black;
}

.white {
  background-color: lightgrey;
}
.pagination :deep(button) {
  color: #095273!important;
}

.pagination :deep(.page-item.active) :deep(.page-link) {
  background-color: lightgray!important;
  border-color: darkgray;
}
@media screen and (max-width: 991px) {
  .cell {
    width: 4vw;
    height: 5.0vh;
  }
  .assaylabel {
     line-height: 4.0vh;
     font-size: 1.5vw;
  }
  .chemlabel {
    width: 3.93vw;
    font-size: 1.5vw;
  }
}


</style>
