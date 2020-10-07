<template lang="pug">
v-menu.order-status-switcher(
  :close-on-content-click='false',
  bottom
)
  template(v-slot:activator='{ on, attrs }')
    v-btn(
      v-on='on',
      v-bind='attrs',
      :style='{ color: accessibleColor(statusColor) }',
      :color='statusColor',
      small
    )
      span {{ status }}
      v-icon(right) mdi-chevron-down
  .order-status-switcher__lists
    template(v-for='head in statusList')
      v-list.order-status-switcher__list(
        subheader,
        nav,
        dense
      )
        v-subheader.order-status-switcher__list-subheader {{ head.text }}
        v-list-item.order-status-switcher__list-item(
          v-for='s in head.statuses',
          :value='s.status',
          :style='{ color: `${accessibleColor(s.color)} !important`, backgroundColor: s.color }',
          :key='s.status',
          :disabled='status === s.status',
          :class='{ selected: status === s.status }',
          @click='setStatus(s.status)'
        )
          v-list-item-content
            v-list-item-title {{ s.status }}
        v-divider
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { filter, each } from 'lodash'
import { getCorrectTextColor } from '@/api/helpers'
import { ordersModule } from '@/store'
import { ordersAPI } from '@/api'

@Component
export default class MOrderStatusSwitcher extends Vue {
  @Prop({ required: true, type: String }) status!: string
  @Prop({ default: 'modal', type: String }) scope!: string
  @Prop({ type: [String, Number] }) orderid!: string | number

  public statusList = [
    {
      text: 'Новые',
      statuses: [
        {
          color: '#1858a1',
          status: 'Отремонтирован',
        },
        {
          color: '#1858a1',
          status: 'Новый',
        },
      ],
    },
    {
      text: 'На исполнении',
      statuses: [
        {
          color: '#689f38',
          status: 'В работе',
        },
        {
          color: '#689f38',
          status: 'На тестировании',
        },
        {
          color: '#689f38',
          status: 'На уточнении',
        },
      ],
    },
    {
      text: 'Отложенные',
      statuses: [
        {
          color: '#FB8C00',
          status: 'Позвонить повторно',
        },
        {
          color: '#FB8C00',
          status: 'Ждёт запчасть',
        },
        {
          color: '#FB8C00',
          status: 'Нужно решить',
        },
      ],
    },
    {
      text: 'Готовые',
      statuses: [
        {
          color: '#525252',
          status: 'Готов',
        },
        {
          color: '#525252',
          status: 'Готов, без ремонта',
        },
        {
          color: '#525252',
          status: 'На продаже',
        },
      ],
    },
    {
      text: 'Закрытые успешно',
      statuses: [
        {
          color: '#626262',
          status: 'Закрыт',
        },
        {
          color: '#626262',
          status: 'Выкуплен СЦ',
        },
        {
          color: '#626262',
          status: 'Обещали найти',
        },
      ],
    },
    {
      text: 'Закрытые неуспешно',
      statuses: [
        {
          color: '#b9b9b9',
          status: 'Закрыт с вопросом',
        },
      ],
    },
  ]

  get order() {
    return ordersModule.currentOrder
  }

  accessibleColor(hex: string) {
    return getCorrectTextColor(hex)
  }

  async setStatus(status: string) {
    try {
      let response
      if (this.order) {
        response = await ordersAPI(this.order.id).setStatus({ status })
      } else if (this.orderid) {
        response = await ordersAPI(this.orderid).setStatus({ status })
      }

      if (response) {
        this.$notification.success('Успешная смена статуса')
        if (this.scope === 'modal') {
          await ordersModule.getOrder(this.order?.id)
        } else if (this.scope === 'table') {
          await ordersModule.fetch()
        }
      } else {
        this.$notification.error('[Клиент] Произошла ошбика при смене статуса')
      }
    } catch (error) {
      this.$notification.error(`[Сервер] ${error.message}`)
    }
  }

  get statusColor() {
    let status = ''
    each(this.statusList, (el) => {
      const filtered = filter(el.statuses, (e) => {
        return e.status === this.status
      })
      if (filtered.length > 0) {
        status = filtered[0]['color']
      }
    })
    return status
  }
}
</script>

<style lang="sass">
.order-status-switcher
  &__lists
    height: 300px
    overflow-y: scroll
  &__list
    &-subheader
      height: 24px !important
    &-item
      min-height: 24px !important
      height: 24px !important
      &.selected
        opacity: .7
</style>
