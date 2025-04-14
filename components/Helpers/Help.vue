<template>
  <span v-b-popover.html.hover="{customClass: size, content: getHelp.text}">
    <b-icon-info-circle-fill />
  </span>
</template>

<script>
export default {
  name: 'Help',
  props: {
    helpKey: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'radial',
    },
  },
  computed: {
    getByPage() {
      return this.$store.getters['helpTexts/getByPageUrl']
    },
    getHelp() {
      const help = this.getByPage(this.helpKey)
      if (help) {
        let icon,
          trigger,
          placement
        switch (help.iconType) {
        case 'Video':
          icon = 'youtube-play'
          trigger = 'click'
          break
        case 'Information':
          icon = 'info-circle'
          trigger = 'hover'
          break
        case 'Help':
          icon = 'question-circle'
          trigger = 'hover'
          break
        default:
          icon = 'info-circle'
          trigger = 'hover'
        }
        switch (help.helpPosition) {
        case 'right':
          placement = 'right'
          break
        case 'bottom':
          placement = 'bottom'
          break
        case 'left':
          placement = 'left'
          break
        default:
          placement = 'right'
        }
        const helpObj = {
          icon: icon,
          trigger: trigger,
          text: help.helpText,
          position: placement,
        }
        return helpObj
      }
      return false
    },
  },
}
</script>

<style scoped>
.radial {
  max-width: 600px !important;
  text-align: center;
  height: 600px !important;
}
.rra {
  max-width: 600px !important;
  text-align: center;
  height: 600px !important;
}
.fp {
  max-width: 600px !important;
  text-align: center;
  height: 350px !important;
}
.assay {
  max-width: 600px !important;
  text-align: center;
  height: 370px !important;
}
.radial :deep(.popover-body) {
  height: 65% !important;
}
.fp :deep(.popover-body) {
  height: 65% !important;
}
.assay :deep(.popover-body) {
  height: 65% !important;
}
.rra :deep(.popover-body) {
  height: 55% !important;
}
.neradial :deep(.popover-body) {
  background-color: #F5F4F5;
  width: fit-content!important;
}
.neradial :deep(.popover-body) {
  background-color: #F5F4F5;
  width: fit-content!important;
}
.neradial:hover {
  cursor: help !important;
}
</style>
