<template>
  <span>
    <a
      v-if="params.data.details_link"
      target="_blank"
      :href="`${params.data.details_link}`"
      @click="startLoading"
    >
      {{ display }}
    </a>
    <span v-else>
      {{ display }}
    </span>
  </span>
</template>

<script>


export default {
  name: 'GenraChemicalLink',
  computed: {
    display() {
      if (this.params.useField) { return this.params.data[this.params.useField] }
      return `${this.params.value}`
    },
  },
  methods: {
    startLoading() {
      this.$nuxt.$loading.start()
    },
  },
}
</script>

<style lang="scss" scoped>
.displaycontainer {
  width: 100% !important;
  height:100% !important;
  text-overflow: ellipsis;
  font-size: 12px;
}
.high {
  color: white;
}
</style>
