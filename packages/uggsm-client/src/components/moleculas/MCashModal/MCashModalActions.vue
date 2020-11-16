<template lang="pug">
a-center-modal(
  v-if='enabled',
  v-model='modal',
  content-class='cash-modal-actions'
)
  template(#activator='{on, attrs}')
    template(v-if='type === "income"')
      v-btn.mr-2(
        v-on='on',
        v-bind='attrs',
        color='success'
      )
        v-icon(left) mdi-plus
        span Приход
    template(v-if='type === "consumption"')
      v-btn(
        v-on='on',
        v-bind='attrs',
        color='error'
      )
        v-icon(left) mdi-minus
        span Расход
  template(#default='{close}')
    v-card.cash-modal-actions__card
      v-toolbar
        v-toolbar-title {{ type === "income" ? "Приход" : "Расход" }}
        v-spacer
        v-btn(
          @click='close',
          icon
        )
          v-icon mdi-close
      v-card-text.cash-modal-actions__card-text.pa-4
        v-row
          v-col(cols='6')
            a-autocomplete(
              v-model='model.cashier',
              :predefined-items='model.cashier ? [{ text: userCredentials, value: userId }] : []',
              :disabled='isCashierDisabled',
              label='Кассир',
              hide-details,
              endpoint='/master',
              disallow-free-type,
              dense
            )
          v-col(cols='6')
            a-autocomplete(
              v-model='model.customer',
              :predefined-items='customerName ? [{ text: customerName, value: customerName }] : []',
              label='Имя клиента',
              hide-details,
              endpoint='/customer-name',
              disallow-free-type,
              dense
            )
        m-cash-modal-check.my-8(
          v-model='model.price',
          :type='type'
        )
        a-textarea(
          v-model='model.comment',
          label='Комментарий',
          dense
        )
        .mt-8
      v-footer.pa-4
        v-btn(
          @click='sendCash',
          color='primary'
        ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { authModule, settingsModule, cashModule, ordersModule } from '@/store'
import { cashAPI } from '@/api'
import { Order } from '@/typings/api/order'

@Component
export default class MCashModalActions extends Vue {
  @Prop({ required: true, type: String }) type!: 'income' | 'consumption'
  @Prop({ type: [Number, String] }) orderId: any
  @Prop({ type: Object }) customer: any
  @Prop({ type: Boolean, default: true }) enabled!: boolean

  public order: Order | null = null
  public customerName = null
  public modal = false
  public model: any = {
    customer: '',
    price: 0,
    comment: '',
    cashier: '',
  }

  public userCredentials = ''
  public userId = ''

  get isCashierDisabled() {
    const isAdmin = authModule.user?.role === 'administrator'

    if (isAdmin) {
      return false
    }

    if (this.order) {
      if (this.order.status === 'Закрыт') {
        return true
      }

      if (this.type === 'income') {
        return true
      }
    }

    return false
  }

  async sendCash() {
    const request: any = {
      comment: this.model.comment,
      cashier: this.model.cashier,
    }

    if (this.orderId) {
      request.orderid = this.orderId
    }

    if (!this.model.price || !parseInt(this.model.price) || !(this.model.price >= 0)) {
      this.$notification.error('[Клиент] Невозможно добавить запись с НЕ положительной ценой')
      return Promise.resolve(false)
    }

    if (this.type === 'income') {
      request.income = Math.abs(this.model.price)
    } else if (this.type === 'consumption') {
      request.consumption = Math.abs(this.model.price)
    }

    if (this.model.customer) {
      try {
        const response = await this.$axios.get(`/client/name/${this.model.customer}`)

        if (response.status === 200) {
          request.client = response.data._id
        } else {
          this.$notification.error('[Клиент] Не удалось найти клиента')
          return Promise.resolve(false)
        }
      } catch (error) {
        this.$notification.error('[Сервер] ' + error.message)
        return Promise.resolve(false)
      }
    }

    try {
      const response = await cashAPI(settingsModule.office.code).createByOffice(request)

      if (response) {
        this.$notification.success('Успешное сохранение чека')
        this.model = {
          customer: '',
          price: 0,
          comment: '',
          cashier: this.userId,
        }
        this.modal = false
      } else {
        this.$notification.error('[Клиент] Не удалось сохранить чек')
      }
    } catch (error) {
      this.$notification.error('[Сервер] ' + error.message)
    }
  }

  async mounted() {
    if (this.orderId) {
      const order = await ordersModule.getOrder(this.orderId)
      this.order = order
      this.model.cashier = order.master._id
      this.userId = order.master._id
      this.userCredentials = order.master.credentials
    } else {
      this.model.cashier = authModule.user?._id
      if (authModule.user) {
        this.userId = authModule.user?._id
        this.userCredentials = authModule.user?.credentials
      }
    }

    if (this.customer) {
      this.customerName = this.customer.name
      this.model.customer = this.customer.name
    }
  }
}
</script>

<style lang="sass">
.cash-modal-actions
  overflow: hidden
  &__card
    &-text
      overflow-y: scroll
      height: calc(50vh)
</style>
