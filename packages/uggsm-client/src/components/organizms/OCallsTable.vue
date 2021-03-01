<template lang="pug">
.calls-table
  m-remote-table(
    :store='store',
    :display-office-switcher='false'
  )
    template(#item.answered='{value}')
      template(v-if='value === "Да"')
        span {{ value }}
      template(v-if='value === "Нет"')
        span.error--text {{ value }}
    template(#item.clientNumber='{value}')
      span {{ value | VMask("+7 (###) ###-##-##") }}
    template(#item.managerNumber='{value}')
      span {{ value | VMask("+7 (###) ###-##-##") }}
    template(#item.order='{value}')
      template(v-if='value')
        o-order-modal-regular(:orderid='value.id')
          template(#activator='{on, attrs}')
            v-btn(
              v-on='on',
              v-bind='attrs',
              :style='{ background: value.quick ? "rgba(255, 82, 82, .4)" : "" }',
              text,
              small
            )
              v-icon(left) mdi-pencil
              span {{ value.id }}
      template(v-else)
        span.error--text Не найдена
    template(#item.record='{value, item}')
      template(v-if='value')
        template(v-if='$can("listenCalls", "Global")')
          ug-bottom-audioplayer(
            :title='item.manager',
            :subtitle='item.managerNumber + " -> " + item.clientNumber',
            :audio='value'
          )
            template(#activator='{on, attrs, duration}')
              div(
                v-on='on',
                v-bind='attrs'
              )
                template(v-if='duration > 0')
                  v-btn(
                    text,
                    small
                  )
                    v-icon(left) mdi-play
                    span Прослушать
                template(v-else)
                  span.error--text Запись недоступна
        template(v-else)
          span.error--text Прослушивание недоступно
      template(v-else)
        span.error--text Не найдена
</template>

<script lang="ts">
import UgBottomAudioplayer from '@/components/base/ui/bottom-audioplayer/bottom-audioplayer.vue'

import { Component, Vue } from 'vue-property-decorator'
import { callModule } from '@/store'

@Component({
  components: {
    UgBottomAudioplayer,
  },
})
export default class OCallsTable extends Vue {
  get store() {
    return callModule
  }
}
</script>

<style lang="sass">
.orders-table
  .orders-table-toolbar
    .v-toolbar__content
      padding: 0 !important
      padding-right: 16px !important
  .v-data-table__wrapper
    table
      thead, tbody
        tr
          th, td
            white-space: nowrap
</style>
