<template lang="pug">
ug-modal-center.ug-modal-cash-income(v-model='modal')
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
      ug-base-btn(
        v-on='on',
        v-bind='attrs',
        label='Приход',
        icon-left='mdi-plus',
        color='success'
      )
  template(#default='{close}')
    v-card
      v-toolbar(tile)
        v-toolbar-title Приход по кассе
        v-spacer
        v-btn(
          @click='close',
          icon
        )
          v-icon mdi-close
      v-card-text.pa-4
        ug-cash-receipt.my-4(
          v-model='model.price',
          type='income'
        )
        v-row(no-gutters)
          v-col.pr-md-2.pr-lg-2(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-autocomplete(
              v-model='model.cashier',
              :predefined-items='model.cashier ? [{ text: userCredentials, value: userId }] : []',
              :disabled='isCashierFieldDisabled',
              label='Кассир',
              icon='mdi-account-tie',
              endpoint='/master',
              disallow-free-type
            )
          v-col.pl-md-2.pl-lg-2(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-autocomplete(
              v-model='model.customer',
              :predefined-items='customerName ? [{ text: customerName, value: customerName }] : []',
              label='Имя клиента',
              icon='mdi-card-account-details',
              endpoint='/customer-name',
              disallow-free-type
            )
        ug-base-textarea(
          v-model='model.comment',
          label='Комментарий',
          icon='mdi-comment-edit',
          dense
        )
        v-divider.mt-2.mb-10

      v-footer.px-4(
        height='48',
        absolute
      )
        v-btn(
          @click='sendCash',
          color='primary'
        ) Сохранить
</template>

<script>
import { mapState } from 'vuex'

import UgModalCenter from '@/components/base/ui/modal-center/modal-center'
import UgBaseTextarea from '@/components/base/ui/base-textarea/base-textarea'
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgCashReceipt from '@/components/cash/cash-receipt/cash-receipt'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import CashAPI from '@/api/cash'
import ClientAPI from '@/api/client'
import OrderAPI from '@/api/order'

export default {
  name: 'ug-modal-cash-consumption',

  components: {
    UgModalCenter,
    UgBaseTextarea,
    UgBaseAutocomplete,
    UgCashReceipt,
    UgBaseBtn,
  },

  props: {
    orderId: {
      required: false,
      type: [Number, String],
      default: '',
    },

    customer: {
      required: false,
      type: [Object],
      default: () => ({}),
    },
  },

  data: function () {
    return {
      order: null,
      customerName: null,
      modal: false,
      model: {
        customer: '',
        price: 0,
        comment: '',
        cashier: '',
      },

      userCredentials: '',
      userId: '',
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      office: (state) => state.settings.office,
    }),

    isCashierFieldDisabled() {
      if (this.$can('manage', 'all')) {
        return false
      }

      if (this.order !== null && this.order.status === 'Закрыт') {
        return true
      }

      return false
    },

    isPriceIncorrect() {
      return !this.model.price || !parseInt(this.model.price) || !(this.model.price >= 0)
    },
  },

  mounted: async function () {
    if (this.orderId) {
      await this.getOrder()
    } else {
      this.model.cashier = this.user._id
      this.userId = this.user._id
      this.userCredentials = this.user.credentials
    }

    if (this.customer) {
      this.customerName = this.customer.name
      this.model.customer = this.customer.name
    }
  },

  methods: {
    rewind() {
      this.model = {
        customer: '',
        price: 0,
        comment: '',
        cashier: this.userId,
      }
      this.modal = false
    },

    async getOrder() {
      const response = await OrderAPI.getById(this.orderId)

      if (response.status !== 200) {
        this.$notification.error('Не удалось найти заявку')
        return
      }

      this.order = response.data
      this.model.cashier = this.order.master._id
      this.userId = this.order.master._id
      this.userCredentials = this.order.master.credentials
    },

    async getCustomer() {
      const response = await ClientAPI.getByName(this.model.customer)

      if (response.status !== 200) {
        this.$notification.error('Не удалось найти клиента')
        return
      }

      return response.data._id
    },

    async sendCash() {
      const request = {
        comment: this.model.comment,
        cashier: this.model.cashier,
        income: Math.abs(this.model.price),
      }

      if (this.orderId) {
        request.orderid = this.orderId
      }

      if (this.isPriceIncorrect) {
        this.$notification.error('Стоимость должна быть положительным числом!')
        return
      }

      if (this.model.customer) {
        const customerId = await this.getCustomer()

        if (customerId) {
          request.client = customerId
        }
      }

      const response = await CashAPI.createByOffice(this.office.code, request)

      if (response.status !== 200) {
        this.$notification.error('Не удалось сохранить чек')
        return
      }

      this.$notification.success('Успешное сохранение чека')
      this.rewind()
    },
  },
}
</script>
