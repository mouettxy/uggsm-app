<template lang="pug">
.order-modal-workflow(
  v-if='!newOrder',
  :class='{ "order-modal-workflow--payed": order ? order.payed : false }'
)
  .d-none(v-if='order')
    m-print-receipt(
      :serial-number='order.serialNumber',
      :phone-model='order.phoneModel',
      :password='order.password',
      :order-id='order.id',
      :kit='order.kit',
      :estimated-close-at='order.estimatedCloseAt',
      :declared-price='order.declaredPrice',
      :declared-deffect='order.declaredDefect',
      :customer-phone='order.customerPhone',
      :customer-name='order.customerName',
      :created-at='order.createdAt',
      :appearance='order.appearance',
      avance='200'
    )
    m-print-warranty(
      :serial-number='order.serialNumber',
      :phone-model='order.phoneModel',
      :order-id='order.id',
      :declared-deffect='order.declaredDefect',
      :customer-phone='order.customerPhone',
      :customer-name='order.customerName',
      :created-at='order.createdAt'
    )
    m-print-check(
      :works='order.statusWork',
      :order-id='order.id',
      :customer-name='order.customerName'
    )
  v-toolbar.order-modal-workflow__header(
    flat,
    dense
  )
    v-menu(
      close-on-click,
      bottom
    )
      template(v-slot:activator='{ on, attrs }')
        v-btn(
          v-on='on',
          v-bind='attrs',
          small,
          color='secondary'
        )
          v-icon mdi-printer
      v-list(dense)
        v-list-item-group
          v-list-item(@click='$htmlToPaper("print-warranty")')
            v-list-item-content
              v-list-item-title Гарантия
          v-list-item(@click='$htmlToPaper("print-receipt")')
            v-list-item-content
              v-list-item-title Приемная квитанция
          v-list-item(@click='$htmlToPaper("print-check")')
            v-list-item-content
              v-list-item-title Товарный чек
    v-spacer
    v-menu(
      close-on-click,
      bottom
    )
      template(v-slot:activator='{ on, attrs }')
        v-btn(
          v-on='on',
          v-bind='attrs',
          small,
          color='secondary'
        )
          v-icon mdi-swap-horizontal
      v-list(dense)
        v-list-item-group
          v-list-item(
            v-for='office in offices',
            :key='office.id',
            @click='changeOffice(office.code)'
          )
            v-list-item-content
              v-list-item-title {{ office.code }}|{{ office.name }}
    v-spacer
    // TODO: add modal sms
    v-btn(
      small,
      color='secondary'
    )
      v-icon(left) mdi-cellphone
      span SMS
  .order-modal-workflow__content
    a-timeline
      template(v-for='workflow in workflows')
        a-timeline-time(
          :date='workflow[0]',
          :color='workflow[1][0]["color"]'
        )
        a-timeline-item(
          v-for='action in workflow[1]',
          :key='action.id',
          :item='action'
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { officesModule, ordersModule } from '@/store'
import moment from 'moment'

import { each, cloneDeep, find, includes } from 'lodash'
import { ordersAPI } from '@/api'
import { getCorrectTextColor } from '@/api/helpers'

@Component
export default class MOrderModalWorkflow extends Vue {
  @Prop(Boolean) newOrder: any

  get order() {
    return ordersModule.currentOrder
  }

  get offices() {
    return officesModule.offices
  }

  get console() {
    return console
  }

  get workflows() {
    const unitedDates: any = []

    const uniteDate = (date: Date) => {
      return moment(this.normalizeDate(date).split(' ')[0], 'DD.MM.YYY').locale('ru').format('D MMMM')
    }

    if (this.order) {
      each(this.order.workflow, (el) => {
        const unitedDate = uniteDate(el.date)
        if (
          !find(unitedDates, (e) => {
            return e[0] === unitedDate
          })
        ) {
          unitedDates.push([unitedDate, []])
        }
      })

      each(this.order.workflow, (el) => {
        const e = cloneDeep(el)

        let type = 'message'
        let color = '#1858a1'
        let icon = 'mdi-account'

        const date = this.normalizeDate(e.date).split(' ')[1]

        if (e.header === 'Смена статуса заказа') {
          type = 'solo'
          e.header = e.message
          if (includes(['Новый', 'Отремонтирован'], e.header)) {
            color = '#1859a1'
          } else if (includes(['В работе', 'На тестировании', 'На уточнении'], e.header)) {
            color = '#689f38'
          } else if (includes(['Позвонить повторно', 'Ждёт запчасть', 'Нужно решить'], e.header)) {
            color = '#FB8C00'
          } else if (includes(['Готов', 'Готов, без ремонта', 'На продаже'], e.header)) {
            color = '#525252'
          } else if (includes(['Закрыт с вопросом'], e.header)) {
            color = '#b9b9b9'
          } else if (includes(['Закрыт', 'Обещали найти', 'Выкуплен СЦ'], e.header)) {
            color = '#626262'
          }
        }

        if (e.header === 'Закрыта работа') {
          color = '#c3a442'
          icon = 'mdi-account-cog'
        } else if (e.header === 'Назначен клиент') {
          color = '#1b78c3'
          icon = 'mdi-account'
        } else if (e.header === 'Назначен мастер' || e.header === 'Смена мастера') {
          color = '#1e89d8'
          icon = 'mdi-account-hard-hat'
        } else if (e.header === 'Назначен менеджер' || e.header === 'Смена менеджера') {
          color = '#1f9dec'
          icon = 'mdi-account-cowboy-hat'
        } else if (e.header === 'Изменение офиса') {
          color = '#1d18a1'
          icon = 'mdi-swap-horizontal'
        } else if (e.header === 'Новый комментарий') {
          color = '#689f38'
          icon = 'mdi-pencil'
        } else if (e.header === 'Смена статуса оплаты') {
          color = '#FF5252'
          icon = 'mdi-cash'
        }

        const workflow = {
          id: e.id,
          type,
          color,
          textColor: getCorrectTextColor(color),
          date,
          icon,
          message: e.message,
          header: e.header,
          username: e.username,
        }

        const uniteDateArr = find(unitedDates, (unitedDate: any) => {
          return unitedDate[0] === uniteDate(e.date)
        })[1]
        uniteDateArr.push(workflow)
      })
    }
    return unitedDates
  }

  async changeOffice(office: string) {
    try {
      if (this.order) {
        const response = await ordersAPI(this.order.id).setOffice({ office })

        if (response) {
          this.$notification.success('Успешная смена офиса')
          await ordersModule.getOrder(this.order.id)
        } else {
          this.$notification.error('Ошибка при смене офиса')
        }
      }
    } catch (error) {
      this.$notification.error(error.message)
    }
  }

  normalizeDate(date: Date) {
    const momented = moment(date).format('DD.MM.YYYY HH:mm')

    return momented
  }
}
</script>

<style lang="sass">
.order-modal-workflow
  height: calc(100vh - 60px)
  overflow-y: scroll
  &--payed
    height: calc(100vh - 80px)
</style>
