<template lang="pug">
a-center-modal(
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
    template(v-if='isDisplayConsumption')
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
        a-autocomplete(
          v-model='model.customer',
          :predefined-items='customerName ? [{ text: customerName, value: customerName }] : []',
          label='Имя клиента',
          hide-details,
          endpoint='/customer-name',
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
        a-autocomplete(
          v-model='model.cashier',
          :predefined-items='model.cashier ? [{ text: userCredentials, value: userId }] : []',
          label='Кассир',
          hide-details,
          endpoint='/manager',
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
import { authModule, settingsModule, cashModule } from '@/store'
import { cashAPI } from '@/api'

@Component
export default class MCashModalActions extends Vue {
  @Prop({ required: true, type: String }) type!: 'income' | 'consumption'
  @Prop({ type: [Number, String] }) orderId: any
  @Prop({ type: Object }) customer: any

  public customerName = null
  public modal = false
  public model: any = {
    customer: '',
    price: 0,
    comment: '',
    cashier: '',
  }

  get isDisplayConsumption() {
    return this.type === 'consumption' && authModule.user.role === 'administrator'
  }

  get userCredentials() {
    return authModule.user.credentials
  }

  get userId() {
    return authModule.user._id
  }

  async sendCash() {
    const request: any = {
      comment: this.model.comment,
      cashier: this.model.cashier,
    }

    if (this.orderId) {
      request.orderid = this.orderId
    }

    if (!this.model.price || !parseInt(this.model.price)) {
      this.$notification.error('[Клиент] Невозможно добавить запись с НЕ положительной ценой')
      return Promise.resolve(false)
    }

    if (this.type === 'income') {
      request.income = this.model.price
    } else if (this.type === 'consumption') {
      request.consumption = this.model.price
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
        if (this.customerName || this.orderId) {
          await cashModule.getCash(this.orderId)
        } else {
          await cashModule.fetch()
        }
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

  mounted() {
    if (this.userId) {
      this.model.cashier = this.userId
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
