<template lang="pug">
.order-modal-cash
  .text-h5.mb-4 Оплата
  v-toolbar(
    flat,
    dense
  )
    template(v-if='displayActions')
      m-cash-modal-actions(
        :order-id='order.id',
        :customer='order.customer',
        type='income'
      )
      m-cash-modal-actions(
        :order-id='order.id',
        :customer='order.customer',
        type='consumption'
      )
    v-spacer
    v-btn(
      :disabled='!displayActions',
      :color='order.payed ? "success" : "error"',
      @click='setPayed'
    )
      v-icon(left) {{ order.payed ? "mdi-check" : "mdi-close" }}
      span Оплачено
  v-data-table(
    :items='cashes',
    :headers='headers',
    no-data-text='Нет оплат',
    hide-default-footer,
    dense
  )
  table.order-modal-cash__table
    tbody
      tr
        td.order-modal-cash__table__item.text-right Итого:
        td.order-modal-cash__table__item.text-right {{ total }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ordersModule, cashModule, authModule } from '@/store'
import { map, reduce } from 'lodash'
import { ordersAPI } from '@/api'
import { Order } from '@/typings/api/order'
import moment from 'moment'

@Component
export default class OOrderModalRegularCash extends Vue {
  @Prop({}) order!: Order

  public headers: any = [
    {
      text: 'Дата',
      value: 'createdAt',
      show: true,
    },
    {
      text: 'Комментарий',
      value: 'comment',
      show: true,
    },
    {
      text: 'Сумма',
      value: 'total',
      show: true,
    },
  ]

  get cashes() {
    return map(this.order.cash, (e) => {
      return {
        id: e.id,
        createdAt: moment(e.createdAt).format('DD MMMM YYYY HH:mm'),
        comment: e.comment,
        total: e.income - e.consumption,
        consumption: e.consumption,
        orderid: e.orderid,
      }
    })
  }

  get total() {
    return reduce(
      this.cashes,
      (a, e) => {
        a += e.total
        return a
      },
      0
    )
  }

  get totalWorks() {
    return reduce(
      this.order.statusWork,
      (a, e) => {
        a += e.price
        return a
      },
      0
    )
  }

  get totalConsumption() {
    return reduce(
      this.cashes,
      (a, e) => {
        a += e.consumption
        return a
      },
      0
    )
  }

  get displayActions() {
    if (authModule.user?.role === 'administrator') {
      return true
    }

    if (this.order?.closedAt) {
      return false
    } else {
      return true
    }
  }

  async setPayed() {
    try {
      if (this.order) {
        const response = await ordersAPI(this.order.id).setPayed({ payed: !this.order.payed })

        if (response) {
          this.$notification.success('Успешно изменён статус оплаты заказа')
        } else {
          this.$notification.error('[Клиент] Не удалось изменить статус оплаты заказа')
        }
      } else {
        this.$notification.error('[Клиент] Не удалось изменить статус оплаты заказа')
      }
    } catch (error) {
      this.$notification.error('[Сервер] ' + error.message)
    }
  }
}
</script>

<style lang="sass">
.order-modal-cash
  &__table
    width: 100%
    &__item
      padding-top: 12px
      padding-bottom: 12px
      font-size: 1.15rem
</style>
