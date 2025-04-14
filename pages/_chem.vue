<template>
  <div>
    <index :chem="chem" />
  </div>
</template>

<script>
import index from './index.vue'

export default {
  name: 'GenRA',
  components: {
    index,
  },
  asyncData(vueContext) {
    return {
      chem: vueContext.route.params.chem,
    }
  },
}
</script>

<style scoped>

</style>
