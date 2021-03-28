<template>
  <ug-modal-fullscreen v-model="modal" content-class="ug-modal-order-new">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <ug-modal-content sidebar main-no-padding main-no-scroll>
      <template #header>
        <h5 class="text-h5">Заказ №{{ orderId }}</h5>
      </template>

      <template #main>
        <v-tabs>
          <v-tab v-for="tab in tabs" :key="tab.key">
            <span>{{ tab.title }}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab" class="ug-modal-order__tabs" touchless>
          <v-tab-item v-for="tab in tabs" :key="tab.key">
            <span>{{ tab.component }}</span>
            <span>{{ order }}</span>
          </v-tab-item>
        </v-tabs-items>
      </template>

      <template #sidebar>
        <ug-modal-order-sidebar
          :order-workflow="order ? order.workflow : []"
          :order-calls="order ? order.statusCalls : []"
        ></ug-modal-order-sidebar>
      </template>

      <template #footer>
        <ug-base-btn
          icon-left="mdi-content-save"
          label="Обновить"
          color="primary"
          @click="handleUpdateClick"
        ></ug-base-btn>
        <ug-base-btn icon-left="mdi-close" label="Закрыть" color="light" @click="handleCloseClick"></ug-base-btn>
      </template>
    </ug-modal-content>
  </ug-modal-fullscreen>
</template>

<script>
import UgModalFullscreen from '@/components/base/ui/modal-fullscreen/modal-fullscreen'
import UgModalContent from '@/components/base/ui/modal-content/modal-content'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn.vue'

import UgModalOrderSidebar from '@/components/order/modal-order/modal-order-sidebar/modal-order-sidebar'

import { mapState } from 'vuex'
import OrderAPI from '@/api/order'

export default {
  name: 'ug-modal-order-new',

  components: {
    UgModalFullscreen,
    UgModalContent,
    UgBaseBtn,
    UgModalOrderSidebar,
  },

  props: {
    orderId: {
      required: true,
      type: [String, Number],
    },
  },

  data: () => ({
    modal: false,

    order: null,

    currentTab: 0,
    tabs: [
      {
        key: 'info',
        title: 'Заказ',
        component: 'ug-modal-order-info',
      },
      {
        key: 'work',
        title: 'Работы',
        component: 'ug-modal-order-work',
      },
      {
        key: 'cash',
        title: 'Платежи',
        component: 'ug-modal-order-cash',
      },
    ],
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  watch: {
    modal(value) {
      if (value) {
        this.getOrder()
        return
      }

      this.order = null
    },
  },

  methods: {
    rewindModal() {
      this.modal = false
    },

    async getOrder() {
      const response = await OrderAPI.getById(this.orderId)

      if (response.status !== 200) {
        this.$notification.error('Не удалось получить заказ')
        this.rewindModal()
        return
      }

      this.order = response.data
    },

    checkOrderModel() {
      /* if (!this.orderModel.orderType) {
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
      } */

      return true
    },

    async updateOrder() {
      //
    },

    async handleUpdateClick() {
      //
    },

    handleCloseClick() {
      this.rewindModal()
    },
  },
}
</script>

<style lang="sass">
.ug-modal-order__tabs
  height: calc(100% - 60px)
  overflow-y: scroll
</style>
