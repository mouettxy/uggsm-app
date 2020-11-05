<template lang="pug">
v-menu.order-status-switcher(
  :close-on-content-click='false',
  min-width='200px',
  max-height='300px',
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
import { filter, each, reduce, includes } from 'lodash'
import { getCorrectTextColor } from '@/api/helpers'
import { ordersModule, authModule, cashModule } from '@/store'
import { ordersAPI } from '@/api'
import { Order } from '@/typings/api/order'
import { groupedStatuses } from '@/api/helpers/enums'

@Component
export default class MOrderStatusSwitcher extends Vue {
  @Prop({ required: true, type: String }) status!: string
  @Prop({ default: 'modal', type: String }) scope!: string
  @Prop({ type: [String, Number] }) orderid!: string | number

  public order: Order | null = null

  get statusList() {
    if (this.status === 'Закрыт' && authModule.user?.role !== 'administrator') {
      return [
        {
          text: 'Закрытые успешно',
          statuses: [
            {
              color: '#626262',
              status: 'Закрыт',
            },
          ],
        },
      ]
    }

    return groupedStatuses
  }

  accessibleColor(hex: string) {
    return getCorrectTextColor(hex)
  }

  async setPayed(order: any) {
    try {
      if (order) {
        const response = await ordersAPI(order.id).setPayed({ payed: !order.payed })

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

  async getCashPrepay(order: Order) {
    let skipCash = false
    let income = reduce(
      order.statusWork,
      (a, e) => {
        a += e.price
        return a
      },
      0
    )

    const cash = order.cash

    let consumption
    if (cash.length > 0) {
      const prepaySum = reduce(
        cash,
        (a, e) => {
          a += e.income
          return a
        },
        0
      )

      const difference = prepaySum - income

      if (income === 0 && prepaySum > 0) {
        consumption = prepaySum
      } else if (prepaySum > income && difference > 0) {
        income = difference
      } else if (difference < 0) {
        consumption = difference
      } else if (prepaySum === income) {
        skipCash = true
      }

      return {
        income,
        consumption,
        skipCash,
        difference,
      }
    }

    return {
      income,
      consumption,
      skipCash,
      difference: income,
    }
  }

  async getOrder(): Promise<Order> {
    return await ordersAPI(this.orderid).getById()
  }

  async setCash() {
    try {
      const order = await this.getOrder()

      if (!order || typeof order === 'boolean') {
        this.$notification.error(
          '[Клиент] Не удалось получить заказ, попробуйте сменить статус заказа из редактирования заказа'
        )
        return {
          price: 0,
        }
      }

      let { income, consumption, skipCash, difference } = await this.getCashPrepay(order)

      const payload: any = {
        orderid: order.id,
        client: order.customer._id,
        cashier: authModule.user?._id,
      }

      if (!skipCash) {
        if (consumption) {
          payload.consumption = consumption
        } else {
          payload.income = income
        }

        const response = await cashModule.createCash(payload)

        if (response) {
          this.$notification.success(`Касса по заказу №${order.id} успешно закрыта`)
          await this.setPayed(order)
          return {
            price: Math.abs(difference),
          }
        } else {
          this.$notification.error('[Клиент] Произошла ошбика при закрытии кассы')
        }
      } else {
        this.$notification.success(`Касса по заказу №${order.id} успешно закрыта`)
        await this.setPayed(order)
        return {
          price: reduce(
            order.statusWork,
            (a, e) => {
              a += e.price
              return a
            },
            0
          ),
        }
      }
    } catch (error) {
      this.$notification.error(`[Сервер] ${error.message}`)
      return {
        price: 0,
      }
    }
  }

  async setStatus(status: string) {
    try {
      const response = await ordersAPI(this.orderid).setStatus({ status })

      const order = await this.getOrder()

      if (!order) {
        this.$notification.error(
          '[Клиент] Не удалось получить заказ, попробуйте сменить статус заказа из редактирования заказа'
        )
        return false
      }

      if (response) {
        this.$notification.success('Успешная смена статуса')

        if (status === 'Закрыт') {
          const cash = await this.setCash()
          if (order.customer && order.customer.phone[0].phone)
            await ordersModule.sendSmsOnClosed({
              id: order.id,
              phone: '8' + order.customer.phone[0].phone,
              model: `${order.phoneBrand} ${order.phoneModel}`,
              price: cash?.price || 0,
            })
        } else if (status === 'Готов, без ремонта') {
          if (order.customer && order.customer.phone[0].phone)
            await ordersModule.sendSmsOnClosedWithoutWork({
              id: order.id,
              phone: '8' + order.customer.phone[0].phone,
              model: `${order.phoneBrand} ${order.phoneModel}`,
              price: reduce(
                order.statusWork,
                (a, e) => {
                  a += e.price
                  return a
                },
                0
              ),
            })
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
  width: 250px !important
  &__list
    &-subheader
      height: 24px !important
    &-item
      min-height: 24px !important
      height: 24px !important
      &.selected
        opacity: .7
</style>
