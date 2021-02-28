<template lang="pug">
.ug-order-timeline
  div(v-for='workflowItem in normalizedWorkflows')
    .ug-order-timeline__time
      ug-order-timeline-line(:color='getFirstAviableColor(workflowItem.actions)')
      span {{ workflowItem.date }}
    .ug-order-timeline__action(
      v-for='action in workflowItem.actions',
      :key='action.id'
    )
      ug-order-timeline-action(:action='action')
        template(#custom.content-title='{value, item}')
          slot(
            name='custom.content-title',
            :value='value',
            :item='item'
          )
        template(#custom.content-date='{value, item}')
          slot(
            name='custom.content-date',
            :value='value',
            :item='item'
          )
        template(#custom.content-body='{value, item}')
          slot(
            name='custom.content-body',
            :value='value',
            :item='item'
          )
</template>

<script>
import UgOrderTimelineLine, { DEFAULT_TIMELINE_LINE_COLOR } from './order-timeline-line/order-timeline-line'
import UgOrderTimelineAction from './order-timeline-action/order-timeline-action'

export default {
  name: 'ug-order-timeline',

  components: {
    UgOrderTimelineLine,
    UgOrderTimelineAction,
  },

  props: {
    workflow: {
      required: true,
      type: [Array],
    },
  },

  computed: {
    normalizedWorkflows() {
      return this.workflow.map((e) => ({
        date: e[0],
        actions: e[1],
      }))
    },
  },

  methods: {
    getFirstAviableColor(workflowActions) {
      if (workflowActions && workflowActions.length) {
        return workflowActions[0].color
      }

      return DEFAULT_TIMELINE_LINE_COLOR
    },
  },
}
</script>

<style lang="sass">
.ug-order-timeline
  .ug-order-timeline__time
    position: relative
    font-size: 1rem
    text-align: center
    padding: 6px
  .ug-order-timeline__action-content
    padding: 6px
    position: relative
</style>
