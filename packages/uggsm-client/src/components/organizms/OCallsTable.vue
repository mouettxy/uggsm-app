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
        m-bottom-audio-player(
          :title='item.manager',
          :subtitle='item.managerNumber + " -> " + item.clientNumber',
          :audio='value'
        )
          template(#activator='{on, attrs}')
            v-btn(
              v-on='on',
              v-bind='attrs',
              text,
              small
            )
              v-icon(left) mdi-play
              span Прослушать
      template(v-else)
        span.error--text Не найдена
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { callModule } from '@/store'

@Component
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
