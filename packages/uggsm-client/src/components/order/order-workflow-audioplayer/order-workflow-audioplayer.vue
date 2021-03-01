<template lang="pug">
.ug-workflow-audioplayer
  template(v-if='call')
    template(v-if='call.answered')
      template(v-if='$can("listenCalls", "Global")')
        ug-bottom-audioplayer(
          :title='call.manager',
          :subtitle='call.managerNumber + " -> " + call.clientNumber',
          :audio='call.record'
        )
          template(#activator='{on, attrs, duration}')
            template(v-if='duration > 0')
              .ug-workflow-audioplayer__item(
                v-on='on',
                v-bind='attrs'
              )
                v-icon mdi-play
                span Прослушать запись
            template(v-else)
              .ug-workflow-audioplayer__item--red
                v-icon mdi-stop
                span Запись недоступна
      template(v-else)
        .ug-workflow-audioplayer__item--red
          v-icon mdi-stop
          span Прослушивание недоступно
    template(v-else)
      ug-bottom-audioplayer(
        :title='call.manager',
        :subtitle='call.managerNumber + " -> " + call.clientNumber',
        :audio='call.record'
      )
        template(#activator='{on, attrs}')
          .ug-workflow-audioplayer__item--red(
            v-on='on',
            v-bind='attrs'
          )
            v-icon mdi-stop
            span Звонок на номер {{ call.managerNumber | VMask("+7 (###) ###-##-##") }} не отвечен
  template(v-else)
    span.error--text Звонок не найден
</template>

<script lang="ts">
import UgBottomAudioplayer from '@/components/base/ui/bottom-audioplayer/bottom-audioplayer.vue'

export default {
  name: 'ug-order-workflow-audioplayer',

  components: {
    UgBottomAudioplayer,
  },

  props: {
    call: {
      required: true,
      type: [Object],
    },
  },
}
</script>

<style lang="sass">
.ug-workflow-audioplayer
  .ug-workflow-audioplayer__item
    transition: .3s all
    &:hover
      .v-icon
        animation: pulse 2s infinite
      color: #689f38
      background: rgba(0, 0, 0, .05)
  .ug-workflow-audioplayer__item--red
    transition: .3s all
    &:hover
      .v-icon
        color: #FF5252
      color: #FF5252
      background: rgba(0, 0, 0, .05)

@keyframes pulse
  0%
    color: rgba(104, 159, 56, 0.5)
  100%
    color: rgba(104, 159, 56, 1)
</style>
