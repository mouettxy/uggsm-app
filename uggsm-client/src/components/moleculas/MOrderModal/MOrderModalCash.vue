<template lang="pug">
.order-modal-cash
  .text-h5.mb-4 Оплата
  v-toolbar(
    flat,
    dense
  )
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
      tr
        td.order-modal-cash__table__item.text-right Клиент должен нам:
        td.order-modal-cash__table__item.text-right {{ total - order.declaredPrice }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ordersModule, cashModule } from '@/store'
import { reduce } from 'lodash'
import { ordersAPI } from '@/api'

@Component
export default class MOrderModalCash extends Vue {
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

  get order() {
    return ordersModule.currentOrder
  }

  get cashes() {
    return cashModule.cashTableDense
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

  async setPayed() {
    try {
      if (this.order) {
        const response = await ordersAPI(this.order.id).setPayed({ payed: !this.order.payed })

        if (response) {
          this.$notification.success('Успешно изменён статус оплаты заказа')
          await ordersModule.getOrder(this.order.id)
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

  mounted() {
    if (this.order?.id) {
      cashModule.getCash(this.order.id)
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
