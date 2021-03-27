<template>
  <ug-modal-right v-model="modal" content-class="ug-modal-order-guaranty">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <ug-modal-content :loading="isLoading">
      <template #header>
        <h5 class="text-h5">Заявка по гарантии</h5>
      </template>

      <template #main>
        <ug-modal-order-warranty-content
          :order-id.sync="orderId"
          :defect.sync="defect"
          :order="order"
          @update:order-id="handleUpdateOrderId"
        ></ug-modal-order-warranty-content>
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
import UgModalOrderWarrantyContent from '@/components/order/modal-order-warranty/modal-order-warranty-content/modal-order-warranty-content'

import OrderAPI from '@/api/order'
import { createWarrantyOrder } from '@/services/orderService'
import { debounce } from 'lodash'

export default {
  name: 'ug-modal-order-warranty',

  components: {
    UgModalRight,
    UgModalContent,
    UgBaseBtn,
    UgModalOrderWarrantyContent,
  },

  data: () => ({
    modal: false,
    isLoading: true,
    order: null,
    orderId: null,
    defect: '',
    timeout: 300,
  }),

  computed: {
    debouncedGetOrder() {
      return debounce(this.getOrder, this.timeout)
    },
  },

  methods: {
    rewindModal() {
      this.modal = false
      this.isLoading = false
      this.order = null
      this.defect = ''
      this.orderId = ''
    },

    async handleUpdateOrderId() {
      this.isLoading = true

      await this.debouncedGetOrder()
    },

    async getOrder() {
      if (this.orderId) {
        const response = await OrderAPI.getById(this.orderId)

        if (response.status !== 200) {
          this.order = null
          return
        }

        this.order = response.data
        this.isLoading = false
        return
      }

      this.order = null
      this.isLoading = false
    },

    async createWarrantyOrder() {
      const response = await createWarrantyOrder(this.order, this.defect)

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
      if (!(this.order && this.defect && this.order.master && this.order.manager)) {
        this.$notification.error('В заявке не указан мастер или менеджер или не заполнено поле "Дефект".')
        return
      }

      const isOrderCreated = await this.createWarrantyOrder()

      if (isOrderCreated) {
        this.rewindModal()
      }
    },

    handleCloseClick() {
      this.rewindModal()
    },
  },
}
</script>
