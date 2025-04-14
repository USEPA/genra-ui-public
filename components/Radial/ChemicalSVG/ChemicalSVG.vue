<template>
  <!-- <svg :width="size" :height="size"> -->
  <svg width="100%" height="100%">
    <text
      ref="dots"
      class="dots"
      :x="size * .5"
      :y="size * .95"
      font-size="10"
      :title="chem.name"
    >
      ...
    </text>
    <image
      :x="size * .1"
      y="0"
      :width="size * 1"
      :height="size * 1"
      :href="imageUrl"
    />
    <text
      ref="text"
      class="name"
      :x="size * .5"
      :y="size * .95"
      font-size="8"
      :title="chem.name"
    >
      {{ displayChemName }}
    </text>
    <title>{{ chem.name }}</title>
  </svg>
</template>

<script>
export default {
  name: 'ChemicalSVG',
  props: {
    chem: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    imageUrl() {
      return this.$utility.imageUrl(this.chem.chem_id)
    },
    displayChemName() {
      return this.chem.name.length > 9 ? `${'\xA0'}${'\xA0'}${this.chem.name.slice(0, 9)}...` : this.chem.name
    },
  },
}
</script>

<style>
text {
  text-anchor: middle;
}
.dots {
  visibility: hidden;
}
.name {
  padding-top: 10px;
}
@media screen and (min-width: 1900px) {
  .name {
    font-size: 12px;
  }
}
@media screen and (max-width: 992px) {
  .name {
    font-size: 12px;
  }
}
.name:hover {display: block;}

</style>
