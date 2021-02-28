<template lang="pug">
.ug-order-timeline-line(:style='{ backgroundColor: color }')
</template>

<script>
export const DEFAULT_TIMELINE_LINE_COLOR = '#1859a1'

export default {
  name: 'ug-order-timeline-line',

  props: {
    color: {
      required: false,
      type: [String],
      default: DEFAULT_TIMELINE_LINE_COLOR,
    },
  },
}
</script>

<style lang="sass">
.ug-order-timeline-line
  width: 2px
  height: 100%
  position: absolute
  top: 0
  left: 16px
  z-index: 10
</style>
