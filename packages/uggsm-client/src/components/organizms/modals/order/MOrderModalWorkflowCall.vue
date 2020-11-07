<template lang="pug">
.workflow-call
  template(v-if='call')
    template(v-if='call.answered')
      m-bottom-audio-player(
        :title='call.manager',
        :subtitle='call.managerNumber + " -> " + call.clientNumber',
        :audio='call.record'
      )
        template(#activator='{on, attrs}')
          .workflow-call__item(
            v-on='on',
            v-bind='attrs'
          )
            v-icon mdi-play
            span Прослушать запись
    template(v-else)
      m-bottom-audio-player(
        :title='call.manager',
        :subtitle='call.managerNumber + " -> " + call.clientNumber',
        :audio='call.record'
      )
        template(#activator='{on, attrs}')
          .workflow-call__item--red(
            v-on='on',
            v-bind='attrs'
          )
            v-icon mdi-stop
            span Звонок на номер {{ call.managerNumber | VMask("+7 (###) ###-##-##") }} не отвечен
  template(v-else)
    span.error--text Звонок не найден
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MOrderModalWorkflowCall extends Vue {
  @Prop() call!: Record<string, any>
}
</script>

<style lang="sass">
.workflow-call
  .workflow-call__item
    transition: .3s all
    &:hover
      .v-icon
        animation: pulse 2s infinite
      color: #689f38
      background: rgba(0, 0, 0, .05)
  .workflow-call__item--red
    transition: .3s all
    &:hover
      .v-icon
        color: #FF5252
      color: #FF5252
      background: rgba(0, 0, 0, .05)

@keyframes pulse
  0%
    color: rgba(104, 159, 56, 0.1)
  10%
    color: rgba(104, 159, 56, 0.2)
  20%
    color: rgba(104, 159, 56, 0.3)
  30%
    color: rgba(104, 159, 56, 0.4)
  40%
    color: rgba(104, 159, 56, 0.5)
  60%
    color: rgba(104, 159, 56, 0.6)
  70%
    color: rgba(104, 159, 56, 0.7)
  80%
    color: rgba(104, 159, 56, 0.8)
  90%
    color: rgba(104, 159, 56, 0.9)
  100%
    color: rgba(104, 159, 56, 1)
</style>
