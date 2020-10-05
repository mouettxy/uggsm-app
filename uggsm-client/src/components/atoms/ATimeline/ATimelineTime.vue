<template lang="pug">
.timeline-time
  .timeline-time__line(:style='{ backgroundColor: color }')
  span {{ date }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ATimelineTime extends Vue {
  @Prop(String) date: any
  @Prop(String) color: any
}
</script>

<style lang="sass">
.timeline-time
  position: relative
  font-size: 1rem
  text-align: center
  padding: 6px

  &__line
    width: 2px
    height: 100%
    position: absolute
    top: 0
    left: 16px
    z-index: 10
</style>
