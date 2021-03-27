<template>
  <ug-modal-right v-model="modal" content-class="ug-modal-order-new">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <ug-modal-content>
      <template #header>
        <h5 class="text-h5">Новый заказ</h5>
      </template>

      <template #main>
        <ug-modal-order-new-content v-model="orderModel"></ug-modal-order-new-content>
      </template>

      <template #footer>
        <ug-base-btn
          icon-left="mdi-content-save"
          label="Создать"
          color="primary"
          @click="handleCreateClick"
        ></ug-base-btn>
        <ug-base-btn icon-left="mdi-close" label="Закрыть" color="light" @click="handleCloseClick"></ug-base-btn>
      </template>
    </ug-modal-content>
  </ug-modal-right>
</template>

<script>
import UgModalRight from '@/components/base/ui/modal-right/modal-right'
import UgModalContent from '@/components/base/ui/modal-content/modal-content'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn.vue'
import UgModalOrderNewContent from '@/components/order/modal-order-new/modal-order-new-content/modal-order-new-content'

import { createOrder } from '@/services/orderService'
import { mapState } from 'vuex'

export default {
  name: 'ug-modal-order-new',

  components: {
    UgModalRight,
    UgModalContent,
    UgModalOrderNewContent,
    UgBaseBtn,
  },

  data: () => ({
    modal: false,

    orderModel: {
      orderType: 'Платный',
      estimatedCloseAt: '',
      customerName: '',
      customerPhone: '',
      password: '',
      serialNumber: '',
      declaredDefect: '',
      declaredPrice: '',
      phoneBrand: '',
      phoneModel: '',
      appearance: 'царапины и потёртости',
      kit: 'устройство без сим карты, чехла, карты памяти',
      quick: false,
      master: '',
      manager: '',
    },
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  created() {
    this.orderModel.manager = this.user?._id || ''
  },

  methods: {
    rewindModal() {
      this.modal = false
      this.orderModel = {
        orderType: 'Платный',
        estimatedCloseAt: '',
        customerName: '',
        customerPhone: '',
        password: '',
        serialNumber: '',
        declaredDefect: '',
        declaredPrice: '',
        phoneBrand: '',
        phoneModel: '',
        appearance: 'царапины и потёртости',
        kit: 'устройство без сим карты, чехла, карты памяти',
        quick: false,
        master: '',

        manager: this.user?._id || '',
      }
    },

    checkOrderModel() {
      if (!this.orderModel.orderType) {
        this.$notification.error('Заполните поле "Тип Заказа"')
        return false
      } else if (!this.orderModel.customerName) {
        this.$notification.error('Заполните поле "Имя клиента"')
        return false
      } else if (!this.orderModel.customerPhone) {
        this.$notification.error('Заполните поле "Номер телефона"')
        return false
      } else if (!this.orderModel.declaredDefect) {
        this.$notification.error('Заполните поле "Первичная неисправность"')
        return false
      } else if (!this.orderModel.phoneBrand) {
        this.$notification.error('Заполните поле "Бренд телефона"')
        return false
      } else if (!this.orderModel.phoneModel) {
        this.$notification.error('Заполните поле "Модель телефона"')
        return false
      } else if (!this.orderModel.appearance) {
        this.$notification.error('Заполните поле "Внешний вид"')
        return false
      } else if (!this.orderModel.kit) {
        this.$notification.error('Заполните поле "Комплектация"')
        return false
      } else if (!this.orderModel.master) {
        this.$notification.error('Заполните поле "Мастер"')
        return false
      } else if (!this.orderModel.manager) {
        this.$notification.error('Заполните поле "Менеджер"')
        return false
      }

      return true
    },

    async createOrder() {
      const response = await createOrder(this.orderModel)

      if (response.status === 'ERROR') {
        this.$notification.error(response.message)
        return
      }

      if (response.status === 'WARNING') {
        this.$notification.warning(response.message)
        return true
      }

      this.$notification.success(response.message)
      return true
    },

    async handleCreateClick() {
      const isModelCorrect = this.checkOrderModel()

      if (isModelCorrect) {
        const isOrderPassed = await this.createOrder()
        if (isOrderPassed) {
          this.rewindModal()
        }
      }
    },

    handleCloseClick() {
      this.rewindModal()
    },
  },
}
</script>
