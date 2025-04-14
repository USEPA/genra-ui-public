<template>
  <div class="ketcher-container">
    <iframe id="ketcherFrame" ref="ketcherFrame" src="/genra/ketcher/index.html" frameborder="0" style="width: 1080px; height:570px;" />
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  mapGetters, mapActions,
} from 'vuex'

export default {
  name: 'Ketcher',
  computed: {
    ...mapGetters({
      ketcher: 'chemical/getKetcher',
      molFile: 'chemical/getMolFile',
    }),
  },
  mounted() {
    this.ketcherIntervalId = setInterval(this.initiateKetcher.bind(this), 1000)
  },
  created() {
    window.addEventListener('beforeunload', () => {
      this.setKetcher(null)
      clearInterval(this.ketcherIntervalId)
    })
  },
  destroyed() {
    this.setKetcher(null)
    clearInterval(this.ketcherIntervalId)
  },
  beforeDestroy() {
    this.setKetcher(null)
    clearInterval(this.ketcherIntervalId)
  },
  methods: {
    ...mapActions({
      setKetcher: 'chemical/setKetcherObj',
      getCurrentSmileString: 'chemical/setCurrentSmileString',
    }),
    initiateKetcher() {
      const {ketcher} = this.$refs.ketcherFrame.contentWindow
      if (ketcher) {
        clearInterval(this.ketcherIntervalId)
        // console.log('ketcher initiated')
        this.setKetcher(Object.freeze(ketcher))
      }
    },
  },
}
</script>
<style scoped lang="scss">
iframe {
  width: 100%;
  height: 680px;
  border: 0;
}

.ketcher-container {
    width: 100%;
}
</style>
