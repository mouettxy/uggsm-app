<template lang="pug">
.ug-timeline-item
  .ug-timeline-item__line(:style='{ backgroundColor: action.color, color: `${action.textColor} !important` }')
  template(v-if='action.type === "solo"')
    v-tooltip(left)
      template(#activator='{on, attrs}')
        .ug-timeline-item__icon(
          v-on='on',
          v-bind='attrs',
          :style='{ backgroundColor: action.color, color: `${action.textColor} !important` }'
        )
          span.text-overline.pa-2 {{ action.header }}
      .text-subtitle-1 {{ action.username }}
    .ug-timeline-item__content
      .ug-timeline-item__content-header
        .ug-timeline-item__content-header__title
        .ug-timeline-item__content-header__time
          span {{ action.date }}
  template(v-if='action.type === "message"')
    template(v-if='action.username')
      v-tooltip(left)
        template(#activator='{on, attrs}')
          .ug-timeline-item__icon(
            v-on='on',
            v-bind='attrs',
            :style='{ backgroundColor: action.color }'
          )
            v-icon(
              :color='action.textColor',
              size='1.5rem'
            ) {{ action.icon }}
        .text-subtitle-1 {{ action.username }}
        .text-subtitle-2.text-center
          span {{ action.date }}
    template(v-else)
      .ug-timeline-item__icon(:style='{ backgroundColor: action.color }')
        v-icon(
          :color='action.textColor',
          size='1.5rem'
        ) {{ action.icon }}
    .ug-timeline-item__content
      .ug-timeline-item__content-header
        .ug-timeline-item__content-header__title
          span {{ action.header }}
        .ug-timeline-item__content-header__time
          span {{ action.date }}
      .ug-timeline-item__content-body
        span {{ action.message }}
  template(v-if='action.type === "slot"')
    .ug-timeline-item__icon(:style='{ backgroundColor: action.color }')
      slot(
        name='custom.icon',
        :txtcolor='action.textColor',
        :item='action',
        :icon='action.icon',
        :bgcolor='action.color'
      )
        v-icon(
          :color='action.textColor',
          size='1.5rem'
        ) {{ action.icon }}
    .ug-timeline-item__content
      .ug-timeline-item__content-header
        .ug-timeline-item__content-header__title
          slot(
            name='custom.content-title',
            :value='action.header',
            :item='action'
          )
            span {{ action.header }}
        .ug-timeline-item__content-header__time
          slot(
            name='custom.content-date',
            :value='action.date',
            :item='action'
          )
            span {{ action.date }}
      .ug-timeline-item__content-body
        slot(
          name='custom.content-body',
          :value='action.message',
          :item='action'
        )
          span {{ action.message }}
</template>

<script>
export default {
  name: 'ug-order-timeline-action',

  props: {
    action: {
      required: true,
      type: [Object],
    },
  },
}
</script>

<style lang="sass">
.ug-timeline-item
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
    padding: 4px
    height: 32px
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
