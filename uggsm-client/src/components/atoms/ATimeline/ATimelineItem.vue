<template lang="pug">
.timeline-item
  .timeline-item__line(:style='{ backgroundColor: item.color, color: `${item.textColor} !important` }')
  template(v-if='item.type === "solo"')
    .timeline-item__icon(:style='{ backgroundColor: item.color, color: `${item.textColor} !important` }')
      span.text-overline.pa-2 {{ item.header }}
    .timeline-item__content
      .timeline-item__content-header
        .timeline-item__content-header__title
        .timeline-item__content-header__time
          span {{ item.date }}
  template(v-if='item.type === "message"')
    template(v-if='item.username')
      v-tooltip(left)
        template(#activator='{on, attrs}')
          .timeline-item__icon(:style='{ backgroundColor: item.color }', v-on='on', v-bind='attrs')
            v-icon(size='1.5rem', :color='item.textColor') {{ item.icon }}
        .text-subtitle-1 {{ item.username }}
        .text-subtitle-2.text-center
          span {{ item.date }}
    template(v-else)
      .timeline-item__icon(:style='{ backgroundColor: item.color }')
        v-icon(size='1.5rem', :color='item.textColor') {{ item.icon }}
    .timeline-item__content
      .timeline-item__content-header
        .timeline-item__content-header__title
          span {{ item.header }}
        .timeline-item__content-header__time
          span {{ item.date }}
      .timeline-item__content-body
        span {{ item.message }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ATimelineItem extends Vue {
  @Prop(Object) item: any
}
</script>

<style lang="sass">
.timeline-item
  position: relative
  display: flex
  padding: 6px

  &__line
    width: 2px
    height: 100%
    position: absolute
    top: 0
    left: 16px
    z-index: 10

  &__icon
    border-radius: 4px
    height: 28px
    z-index: 100
    white-space: pre

  &__content
    width: 100%
    padding-left: 6px
    padding-right: 6px

    &-header
      display: flex
      margin-top: -4px

      &__title
        flex-grow: 2
      &__time
        font-size: .8rem
        text-align: right
        color: silver
        flex-grow: 1
    &-body
      padding: 4px
      background: #e2f5ff
      margin-top: 6px
      position: relative

      &::after
        content: ''
        position: absolute
        top: -6px
        left: 16px
        width: 0
        height: 0
        border-left: 8px solid transparent
        border-right: 8px solid transparent
        border-bottom: 8px solid #e2f5ff
</style>
